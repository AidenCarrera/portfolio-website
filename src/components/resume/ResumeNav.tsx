"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ResumeNavProps {
  sections: { id: string; label: string }[];
}

// How far down the viewport a section's top has to pass to become current.
const READING_LINE = 0.35;

/**
 * Sticky table of contents for the resume. The current section is the last
 * one whose top has crossed a reading line a third of the way down the
 * screen: the first until then, and the last once the page bottoms out, even
 * if it is too short to reach the line.
 */
export default function ResumeNav({ sections }: ResumeNavProps) {
  const [activeId, setActiveId] = useState<string | undefined>(sections[0]?.id);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const line = window.innerHeight * READING_LINE;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current = sections[0]?.id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= line) {
          current = section.id;
        }
      }

      setActiveId(atBottom ? sections.at(-1)?.id : current);
    };

    const schedule = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(update);
      }
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return (
    <nav aria-label="Resume sections">
      <p className="eyebrow text-muted">On this page</p>
      <ul className="mt-5 space-y-1 border-l border-line">
        {sections.map((section) => {
          const active = section.id === activeId;

          return (
            <li key={section.id} className="relative">
              {active && (
                <motion.span
                  layoutId="resume-nav-active"
                  aria-hidden="true"
                  className="absolute inset-y-1 -left-px w-px bg-brand shadow-[0_0_10px_var(--color-brand)]"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <a
                href={`#${section.id}`}
                aria-current={active ? "location" : undefined}
                className={`block rounded-sm py-1.5 pl-5 text-sm transition-colors ${
                  active ? "text-white" : "text-muted hover:text-slate-300"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
