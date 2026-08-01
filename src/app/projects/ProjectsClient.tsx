"use client";

import { useMemo, useState } from "react";
import RepoGrid from "@/components/projects/RepoGrid";
import CategoryFilter from "@/components/projects/CategoryFilter";
import type { CategoryOption } from "@/components/projects/CategoryFilter";
import type { PortfolioProject } from "@/lib/projects";
import { formatTagName, normalizeTag } from "@/lib/utils";

interface ProjectsClientProps {
  initialProjects: PortfolioProject[];
  defaultSort: SortOption;
}

type SortOption = "featured" | "newest" | "name";

export default function ProjectsClient({
  initialProjects,
  defaultSort,
}: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  // Preserve topic casing for display; use the normalized form only for matching.
  // If spellings differ, prefer the capitalized version (e.g. "GraphQL").
  const categories = useMemo<CategoryOption[]>(() => {
    const topicByCategory = new Map<string, string>();

    for (const project of initialProjects) {
      for (const topic of project.presentation.tags) {
        const category = normalizeTag(topic);
        if (!category) {
          continue;
        }

        const current = topicByCategory.get(category);
        const addsCasing =
          current === current?.toLowerCase() && topic !== topic.toLowerCase();

        if (current === undefined || addsCasing) {
          topicByCategory.set(category, topic);
        }
      }
    }

    return [
      { value: "all", label: "All" },
      ...Array.from(topicByCategory, ([value, topic]) => ({
        value,
        label: formatTagName(topic),
      })).sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [initialProjects]);

  const filteredProjects =
    selectedCategory === "all"
      ? initialProjects
      : initialProjects.filter((project) =>
          project.presentation.tags
            .map((topic) => normalizeTag(topic))
            .includes(selectedCategory),
        );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "featured") {
      if (a.presentation.featured !== b.presentation.featured) {
        return a.presentation.featured ? -1 : 1;
      }
      if (a.presentation.displayOrder !== b.presentation.displayOrder) {
        return a.presentation.displayOrder - b.presentation.displayOrder;
      }
      return a.presentation.repoName.localeCompare(b.presentation.repoName);
    }
    if (sortBy === "newest") {
      return (
        new Date(b.github.createdAt).getTime() -
        new Date(a.github.createdAt).getTime()
      );
    }
    return a.presentation.repoName.localeCompare(b.presentation.repoName);
  });

  return (
    <>
      {initialProjects.length > 0 ? (
        <>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

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

          <RepoGrid projects={sortedProjects} />
        </>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <p className="text-slate-400">No projects found.</p>
        </div>
      )}
    </>
  );
}
