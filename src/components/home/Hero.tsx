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

  const landingLines = profile.landingText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lines = landingLines.length > 0 ? landingLines : [profile.landingText];

  // The availability badge is one word too wide for a phone, so the last word
  // is dropped below `sm` rather than shrinking the type or wrapping the pill.
  const availability = profile.availabilityText.trim();
  const lastSpace = availability.lastIndexOf(" ");
  const availabilityHead =
    lastSpace === -1 ? availability : availability.slice(0, lastSpace);
  const availabilityTail =
    lastSpace === -1 ? "" : availability.slice(lastSpace + 1);

  // Smooth scroll handler that respects reduced motion preferences
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

  return (
    <section className="relative -mt-16 flex min-h-dvh flex-col justify-center overflow-hidden bg-animated-dark px-4 pb-20 pt-20 sm:px-6 sm:pb-32 lg:px-8 lg:pb-40">
      <HeroSpectrum />

      {/* Keeps the headline off the analyser without flattening it out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(2,6,23,0.92),rgba(2,6,23,0.35)_60%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_bottom,transparent_0%,rgba(15,23,42,0.12)_25%,rgba(15,23,42,0.4)_50%,rgba(15,23,42,0.78)_75%,rgb(15,23,42)_100%)] sm:h-72"
      />

      <div className="relative mx-auto w-full max-w-5xl text-center lg:-translate-y-10">
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-brand/20 bg-slate-900 shadow-lg sm:mb-5 sm:h-32 sm:w-32">
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
              // Index, not the text: nothing stops the CMS from repeating a line.
              key={index}
              className={`${
                // Only the opening line earns its keep on a phone; the rest
                // are dropped rather than shrinking the headline to fit.
                index === 0 ? "block" : "hidden sm:block"
              } ${
                index < lines.length - 1
                  ? "bg-linear-to-r from-brand to-brand-dark bg-clip-text text-transparent"
                  : "text-white"
              }`}
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.15 + index * 0.1 }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-5 max-w-3xl text-lg text-white sm:mt-6 sm:text-xl sm:text-slate-300 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.35 }}
        >
          {profile.sloganText}
        </motion.p>

        <motion.div
          className="mt-6 sm:mt-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.45 }}
        >
          <Badge>
            <span className="whitespace-nowrap">
              {availabilityHead}
              {availabilityTail && (
                <span className="hidden sm:inline"> {availabilityTail}</span>
              )}
            </span>
          </Badge>
        </motion.div>

        <motion.div
          className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4"
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
            className="mt-6 sm:mt-7"
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
