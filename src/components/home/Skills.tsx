import {
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
import ArrowLink from "@/components/common/ArrowLink";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { getTechIcon } from "@/lib/techIcons";
import { CHIP, CONTAINER } from "@/lib/styles";
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

/**
 * Two columns at most, so the chips keep a readable size; an odd last card
 * goes full width so the grid never ends on a hole.
 */
function spanFor(index: number, count: number): string {
  return count % 2 === 1 && index === count - 1 ? "md:col-span-2" : "";
}

export default function Skills({ intro, categories }: SkillsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="skills-heading"
      className={`${CONTAINER} py-20 sm:py-28`}
    >
      <Reveal>
        <SectionHeading
          title="Skills"
          id="skills-heading"
          action={<ArrowLink href="/resume">Full resume</ArrowLink>}
        >
          {intro}
        </SectionHeading>
      </Reveal>

      <ul className="mt-14 grid gap-4 md:grid-cols-2">
        {categories.map((category, position) => {
          const Icon = ICONS[category.icon] ?? Code2;

          return (
            // Each card carries its own reveal so the grid arrives in sequence
            // rather than as one block.
            <li
              key={category.key}
              className={spanFor(position, categories.length)}
            >
              <Reveal delay={(position % 2) * 0.08} className="h-full">
                <div className="relative panel h-full rounded-2xl p-6 sm:p-7">
                  <div className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/[0.07] text-brand shadow-[0_0_20px_-8px_rgb(0_255_204/0.4)]">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <h3 className="min-w-0 text-xl font-semibold tracking-tight text-white">
                      {category.name}
                    </h3>
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {category.items.map((item) => {
                      // Skills without a brand mark of their own — "SQL",
                      // "Mixing" — borrow the category's icon so every badge
                      // keeps the same shape.
                      const ItemIcon = getTechIcon(item) ?? Icon;

                      return (
                        // shrink-0: a narrow card would otherwise squeeze
                        // multi-word badges until the label wrapped.
                        <li
                          key={item}
                          className={`${CHIP} shrink-0 transition-colors duration-300 hover:text-brand`}
                        >
                          <ItemIcon
                            aria-hidden
                            className="h-3.5 w-3.5 shrink-0 text-brand"
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
