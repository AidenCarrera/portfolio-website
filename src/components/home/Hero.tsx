"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import Badge from "@/components/common/Badge";
import HeroSpectrum from "./HeroSpectrum";
import type { WebsiteProfile } from "@/lib/profile";

interface HeroProps {
  profile: WebsiteProfile;
  /** Rendered on the server, since the social links come from server-only env vars. */
  socials?: ReactNode;
}

const SPRING = { type: "spring", stiffness: 45, damping: 16 } as const;

export default function Hero({ profile, socials }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  // Every line but the last takes the brand gradient; the last stays white.
  const landingLines = profile.landingText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lines = landingLines.length > 0 ? landingLines : [profile.landingText];

  // Easing this one anchor in JS rather than through a global
  // `scroll-behavior`, which would animate route changes too.
  const scrollToOverview = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const overview = document.getElementById("overview");
    if (!overview) {
      return;
    }

    event.preventDefault();
    overview.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  // The negative top margin cancels the 4rem the layout reserves for the fixed
  // nav so the gradient runs behind the bar with no seam while the bar is
  // transparent; the top padding adds that 4rem back so the content stays put.
  // The heavier bottom pad then sits the block above true centre, since
  // centring happens inside the padding box.
  return (
    <section className="relative -mt-16 flex min-h-dvh flex-col justify-center overflow-hidden bg-animated-dark px-4 pb-32 pt-22 sm:px-6 sm:pb-48 sm:pt-20 lg:px-8 lg:pb-56">
      <HeroSpectrum />

      {/* Keeps the headline off the analyser without flattening it out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(2,6,23,0.92),rgba(2,6,23,0.35)_60%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-slate-900"
      />

      <div className="relative mx-auto w-full max-w-5xl text-center">
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
        >
          <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-brand/20 bg-slate-900 shadow-lg sm:h-32 sm:w-32">
            <Image
              src="/developer-logo.svg"
              alt={`${profile.name} - Audio Developer Logo`}
              width={128}
              height={128}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-brand/20 blur-xl" />
        </motion.div>

        <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
          {lines.map((line, index) => (
            <motion.span
              key={line}
              className={
                index < lines.length - 1
                  ? "block bg-linear-to-r from-brand to-brand-dark bg-clip-text text-transparent"
                  : "block text-white"
              }
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.15 + index * 0.1 }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.35 }}
        >
          {profile.sloganText}
        </motion.p>

        <motion.div
          className="mt-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.45 }}
        >
          <Badge>{profile.availabilityText}</Badge>
        </motion.div>

        <motion.div
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.55 }}
        >
          <Link
            href="/projects"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-dark to-brand-darker px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand/10 transition-all hover:-translate-y-0.5 hover:from-brand hover:to-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto"
          >
            View Projects
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/resume"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto"
          >
            View Resume
          </Link>
        </motion.div>

        {socials && (
          <motion.div
            className="mt-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.65 }}
          >
            {socials}
          </motion.div>
        )}
      </div>

      <motion.a
        href="#overview"
        onClick={scrollToOverview}
        className="group absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-1.5 rounded-lg px-3 py-1 text-slate-500 transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em]">
          Scroll
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="animate-scroll-cue"
        />
      </motion.a>
    </section>
  );
}
