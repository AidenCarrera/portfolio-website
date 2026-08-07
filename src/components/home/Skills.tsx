import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Code2,
  Cpu,
  Database,
  Layers,
  Palette,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionIntro from "./SectionIntro";
import { getTechIcon } from "@/lib/techIcons";
import type { SkillCategory } from "@/lib/profile";
import type { SkillCategoryIcon } from "@/sanity/types";

interface SkillsProps {
  intro: string;
  categories: SkillCategory[];
}

// Keyed to the icon list on the Landing document's Skills tab.
const ICONS: Record<SkillCategoryIcon, LucideIcon> = {
  code: Code2,
  layers: Layers,
  audio: AudioLines,
  terminal: Terminal,
  database: Database,
  chip: Cpu,
  palette: Palette,
  tools: Wrench,
};

export default function Skills({ intro, categories }: SkillsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <Reveal>
        <SectionIntro
          title="Skills"
          action={
            <Link
              href="/resume"
              className="group inline-flex items-center gap-2 rounded font-semibold text-brand transition-colors hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Full resume
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          }
        >
          {intro}
        </SectionIntro>
      </Reveal>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {categories.map((category, index) => {
          const Icon = ICONS[category.icon] ?? Code2;

          return (
            // Each card carries its own reveal so the grid arrives in sequence
            // rather than as one block.
            <li key={category.key} className="h-full">
              <Reveal delay={index * 0.08} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/5 sm:p-7">
                  {/* Hairline across the top edge, lit only on hover. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition-colors group-hover:border-brand/50 group-hover:bg-brand/15">
                      <Icon size={20} aria-hidden="true" />
                    </span>

                    <h3 className="min-w-0 text-lg font-semibold text-white transition-colors group-hover:text-brand">
                      {category.name}
                    </h3>
                  </div>

                  <ul className="relative mt-5 flex flex-wrap gap-2 border-t border-slate-700/60 pt-5">
                    {category.items.map((item) => {
                      // Skills without a brand mark of their own — "SQL",
                      // "Mixing" — borrow the category's icon so every badge
                      // keeps the same shape.
                      const ItemIcon = getTechIcon(item) ?? Icon;

                      return (
                        <li
                          key={item}
                          // shrink-0: a narrow card would otherwise squeeze
                          // multi-word badges until the label wrapped.
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 py-1 pr-2.5 pl-2 text-xs font-medium text-brand-light transition-colors group-hover:border-brand/30"
                        >
                          <ItemIcon
                            aria-hidden
                            className="h-3.5 w-3.5 shrink-0 text-brand/70 transition-colors group-hover:text-brand"
                          />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
