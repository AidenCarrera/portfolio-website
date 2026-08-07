import type { ReactNode } from "react";

interface SectionIntroProps {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}

export default function SectionIntro({
  title,
  children,
  action,
}: SectionIntroProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-[1.75rem] font-bold tracking-tight text-white sm:text-[2rem]">
          {title}
        </h2>
        {children && (
          <p className="mt-4 leading-relaxed text-slate-400">{children}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
