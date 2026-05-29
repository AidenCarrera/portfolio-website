"use client";

import RepoCard from "./RepoCard";
import { GithubRepo } from "@/lib/github";
import { motion } from "motion/react";

interface RepoGridProps {
  repos: GithubRepo[];
  loading?: boolean;
}

export default function RepoGrid({ repos, loading }: RepoGridProps) {
  // Show matching number of skeleton cards, at least 9 to fill rows
  const ghostCount = Math.max(repos.length, 9);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: ghostCount }).map((_, i) => (
              <RepoCard key={i} isGhost />
            ))
          : repos.map((repo) => (
              <motion.div
                key={repo.html_url}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <RepoCard repo={repo} />
              </motion.div>
            ))}
      </div>
    </>
  );
}
