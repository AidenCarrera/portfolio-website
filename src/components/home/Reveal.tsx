"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Seconds to hold before starting, for staggering siblings in a grid. */
  delay?: number;
  className?: string;
}

/**
 * Scroll-in entrance shared by every section below the hero. Reduced motion is
 * handled site-wide by `MotionProvider`, which drops the `y` travel and leaves
 * the opacity fade in place.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 60, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}
