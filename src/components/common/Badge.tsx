import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
      {children}
    </div>
  );
}
