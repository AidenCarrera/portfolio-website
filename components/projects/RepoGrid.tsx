"use client";

import RepoCard from "./RepoCard";
import { GithubRepo } from "@/lib/github";
import { motion } from "framer-motion";

interface RepoGridProps {
  repos: GithubRepo[];
  loading?: boolean;
}

export default function RepoGrid({ repos, loading }: RepoGridProps) {
  // Number of ghost cards while loading
  const ghostCount = 6;

  return (
    <>
      {/* Temporary spacer while loading */}
      {loading && <div className="h-24 md:h-32 lg:h-32" />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: ghostCount }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/30 rounded-xl h-64 animate-pulse"
              />
            ))
          : repos.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <RepoCard repo={repo} />
              </motion.div>
            ))}
      </div>
    </>
  );
}
