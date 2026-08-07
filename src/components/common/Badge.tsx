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
    ? "whitespace-nowrap px-2.5 text-[min(0.875rem,2.4vw)]"
    : "px-3 text-sm";

  return (
    <div
      className={`inline-flex items-center rounded-full border border-brand/25 bg-brand/10 py-1 font-semibold text-brand ${sizing}`}
    >
      {children}
    </div>
  );
}
