import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  // For labels that would wrap on a phone: the type scales with the viewport,
  // capped at the normal 14px, so nothing changes once there is room.
  oneLine?: boolean;
}

export default function Badge({ children, oneLine = false }: BadgeProps) {
  // One branch, not two competing utilities: Tailwind resolves `text-sm` vs
  // `text-[...]` by stylesheet order, so emitting both picks a winner at random.
  const sizing = oneLine
    ? "whitespace-nowrap text-[min(0.8125rem,2.6vw)]"
    : "text-[0.8125rem]";

  return (
    <div
      className={`inline-flex max-w-full items-center rounded-full border border-brand/20 bg-brand/[0.06] px-3.5 py-1.5 font-medium text-brand-pale ${sizing}`}
    >
      <span className="min-w-0">{children}</span>
    </div>
  );
}
