"use client";

import RepoCard from "./RepoCard";
import { GithubRepo } from "@/lib/github";

interface RepoGridProps {
  repos: GithubRepo[];
}

export default function RepoGrid({ repos }: RepoGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
