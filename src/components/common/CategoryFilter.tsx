"use client";

import { useId } from "react";
import { motion } from "motion/react";

export interface CategoryOption {
  /** Stable key compared against `selected` and reported to `onSelect`. */
  value: string;
  /** Display text, already formatted by the caller. */
  label: string;
  /** How many items the option matches, shown beside the label. */
  count?: number;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selected: string;
  onSelect: (category: string) => void;
  /** Names the group for assistive tech, e.g. "Filter projects by topic". */
  label: string;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  label,
}: CategoryFilterProps) {
  // Namespaces the sliding highlight, so two filters on one page never trade
  // highlights with each other.
  const id = useId();

  return (
    <div className="relative -mx-4 md:mx-0">
      {/* Mobile fades indicate horizontal overflow. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-linear-to-r from-ink-900 to-transparent md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-linear-to-l from-ink-900 to-transparent md:hidden" />

      <div
        role="group"
        aria-label={label}
        className="scrollbar-none flex snap-x gap-2 overflow-x-auto px-4 py-1 md:flex-wrap md:overflow-visible md:px-0"
      >
        {categories.map(({ value, label: optionLabel, count }) => {
          const isSelected = selected === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              aria-pressed={isSelected}
              className={`relative isolate shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                isSelected
                  ? "border-transparent text-ink-950"
                  : "border-line text-slate-400 hover:border-line-strong hover:text-white"
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId={`${id}-selected`}
                  aria-hidden="true"
                  className="absolute -inset-px -z-10 rounded-full bg-brand shadow-[0_0_24px_-6px_rgb(0_255_204/0.7)]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              {optionLabel}
              {count !== undefined && (
                <span
                  className={`ml-1.5 font-mono text-[0.6875rem] ${
                    isSelected ? "text-ink-950/60" : "text-muted"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
