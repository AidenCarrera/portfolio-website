"use client";

import { useState } from "react";
import { RepoGrid, CategoryFilter } from "@/components/projects";
import { GithubRepo } from "@/lib/github";

interface ProjectsClientProps {
  initialRepos: GithubRepo[];
}

export default function ProjectsClient({ initialRepos }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(
      new Set(initialRepos.flatMap((r) => r.topics.map((t) => t.toLowerCase())))
    ),
  ];

  const filteredRepos =
    selectedCategory === "all"
      ? initialRepos
      : initialRepos.filter((r) =>
          r.topics.map((t) => t.toLowerCase()).includes(selectedCategory)
        );

  return (
    <>
      {initialRepos.length > 0 ? (
        <>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <RepoGrid repos={filteredRepos} loading={false} />
        </>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <p className="text-slate-400">No projects found.</p>
        </div>
      )}
    </>
  );
}
