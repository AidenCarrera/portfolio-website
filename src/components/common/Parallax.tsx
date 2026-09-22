"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxProps {
  children: ReactNode;
  /** Total travel in pixels across the element's pass through the viewport. */
  distance?: number;
  className?: string;
}

/**
 * Drifts its children against the scroll by a few dozen pixels. Motion drives
 * it from a scroll timeline where the browser has one, and `MotionProvider`
 * turns the transform off for reduced motion.
 */
export default function Parallax({
  children,
  distance = 60,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [distance / 2, -distance / 2],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
