"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
}

/**
 * Scroll-in entrance shared by every section below the hero. Reduced motion is
 * handled site-wide by `MotionProvider`, which drops the `y` travel and leaves
 * the opacity fade in place.
 */
export default function Reveal({ children }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 60, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}
