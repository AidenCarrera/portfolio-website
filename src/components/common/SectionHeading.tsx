import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  /** Id for the heading, so the section can be `aria-labelledby` it. */
  id?: string;
  children?: ReactNode;
  action?: ReactNode;
}

/**
 * The heading every content section opens with: a large title, an optional
 * intro, and an optional link aligned to the baseline.
 */
export default function SectionHeading({
  title,
  id,
  children,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 id={id} className="text-heading text-white">
          {title}
        </h2>
        {children && (
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            {children}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 md:pb-1.5">{action}</div>}
    </div>
  );
}
