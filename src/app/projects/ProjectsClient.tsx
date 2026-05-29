"use client";

import { useState, useRef, useEffect } from "react";
import { RepoGrid, CategoryFilter } from "@/components/projects";
import { GithubRepo } from "@/lib/github";

interface ProjectsClientProps {
  initialRepos: GithubRepo[];
}

type SortOption = "featured" | "newest" | "name";

export default function ProjectsClient({ initialRepos }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    "all",
    ...Array.from(
      new Set(initialRepos.flatMap((r) => r.topics.map((t) => t.toLowerCase())))
    ).sort(),
  ];

  const filteredRepos =
    selectedCategory === "all"
      ? initialRepos
      : initialRepos.filter((r) =>
          r.topics.map((t) => t.toLowerCase()).includes(selectedCategory)
        );

  // Sorting logic based on selected option
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === "featured") {
      return a.priority - b.priority;
    }
    if (sortBy === "newest") {
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    }
    // alphabetical
    return a.name.localeCompare(b.name);
  });

  // Safe transition trigger to prevent double-clicks or fast-click animation failures
  const triggerTransition = (action: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTransitioning(true);
    action();
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 250); // brief 250ms loading skeleton animation
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {initialRepos.length > 0 ? (
        <>
          {/* Category Filtering Row */}
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={(category) => triggerTransition(() => setSelectedCategory(category))}
          />

          {/* Minimal Sort Controls Toolbar */}
          <div className="flex justify-center items-center gap-4 mb-12 text-sm">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Sort By:</span>
            <div className="flex items-center bg-slate-800/40 border border-slate-700/50 rounded-lg p-1">
              {(["featured", "newest", "name"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => triggerTransition(() => setSortBy(option))}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200 cursor-pointer
                    ${
                      sortBy === option
                        ? "bg-brand text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Render Sorted/Filtered Repo Grid */}
          <RepoGrid repos={sortedRepos} loading={isTransitioning} />
        </>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <p className="text-slate-400">No projects found.</p>
        </div>
      )}
    </>
  );
}
