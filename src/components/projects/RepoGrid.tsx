"use client";

import { AnimatePresence, motion } from "motion/react";
import RepoCard from "./RepoCard";
import type { PortfolioProject } from "@/lib/projects";

interface RepoGridProps {
  projects: PortfolioProject[];
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Filtering and sorting reflow the grid in place: cards that stay slide to
 * their new cell, leavers fade out, arrivals fade in. `popLayout` takes the
 * leavers out of flow at once so the rest do not wait on them.
 */
export default function RepoGrid({ projects }: RepoGridProps) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.map((project) => (
          <motion.li
            key={project.github.url}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            <RepoCard project={project} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
