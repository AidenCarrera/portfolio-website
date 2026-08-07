"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide Motion defaults. `reducedMotion="user"` is Motion's documented way
 * to honour the OS setting once for every `motion` component, rather than
 * threading `useReducedMotion` through each one: transform and layout
 * animations are dropped while opacity still fades, so the entrances degrade
 * instead of disappearing.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
