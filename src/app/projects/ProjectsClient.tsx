"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import RepoGrid from "@/components/projects/RepoGrid";
import CategoryFilter from "@/components/common/CategoryFilter";
import type { CategoryOption } from "@/components/common/CategoryFilter";
import type { PortfolioProject } from "@/lib/projects";
import { formatTagName, normalizeTag } from "@/lib/utils";

type SortOption = "featured" | "newest" | "name";

const SORT_OPTIONS: SortOption[] = ["featured", "newest", "name"];

interface ProjectsClientProps {
  projects: PortfolioProject[];
  defaultSort: SortOption;
}

export default function ProjectsClient({
  projects,
  defaultSort,
}: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  // Preserve topic casing for display; use the normalized form only for matching.
  // If spellings differ, prefer the capitalized version (e.g. "GraphQL").
  const categories = useMemo<CategoryOption[]>(() => {
    const topicByCategory = new Map<string, string>();

    for (const project of projects) {
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
  }, [projects]);

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) =>
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

  if (projects.length === 0) {
    return (
      <div className="panel rounded-2xl p-12 text-center">
        <p className="text-slate-400">No projects found.</p>
      </div>
    );
  }

  return (
    <>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        label="Filter projects by topic"
      />

      <div className="mt-8 mb-8 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow text-muted" role="status">
          Showing{" "}
          <span className="text-slate-300">{sortedProjects.length}</span> of{" "}
          {projects.length}
        </p>

        <div className="flex items-center gap-3">
          <span id="sort-label" className="eyebrow text-muted">
            Sort
          </span>
          <div
            role="group"
            aria-labelledby="sort-label"
            className="flex items-center rounded-full border border-line bg-white/[0.02] p-1"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSortBy(option)}
                aria-pressed={sortBy === option}
                className={`relative isolate rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors duration-200 ${
                  sortBy === option
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sortBy === option && (
                  <motion.span
                    layoutId="projects-sort"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <RepoGrid projects={sortedProjects} />
    </>
  );
}
