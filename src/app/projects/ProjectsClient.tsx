"use client";

import { useState } from "react";
import { RepoGrid, CategoryFilter } from "@/components/projects";
import { GithubRepo } from "@/lib/github";

interface ProjectsClientProps {
  initialRepos: GithubRepo[];
}

type SortOption = "featured" | "newest" | "name";

export default function ProjectsClient({ initialRepos }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

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

  return (
    <>
      {initialRepos.length > 0 ? (
        <>
          {/* Category Filtering Row - Instant selection */}
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Minimal Sort Controls Toolbar - Instant sorting */}
          <div className="flex justify-center items-center gap-4 mb-12 text-sm">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">
              Sort By:
            </span>
            <div className="flex items-center bg-slate-800/40 border border-slate-700/50 rounded-lg p-1">
              {(["featured", "newest", "name"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  aria-pressed={sortBy === option}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand
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

          {/* Render Sorted/Filtered Repo Grid instantly without entrance animations */}
          <RepoGrid repos={sortedRepos} loading={false} animateEntrance={false} />
        </>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <p className="text-slate-400">No projects found.</p>
        </div>
      )}
    </>
  );
}
