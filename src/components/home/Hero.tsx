"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import Badge from "@/components/common/Badge";
import HeroSpectrum, { SPECTRUM_TAIL_HEIGHT } from "./HeroSpectrum";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CONTAINER } from "@/lib/styles";
import type { WebsiteProfile } from "@/lib/profile";

interface HeroProps {
  profile: WebsiteProfile;
  /** Rendered on the server, since the social links come from server-only env vars. */
  socials?: ReactNode;
}

function stagger(seconds: number): CSSProperties {
  return { animationDelay: `${seconds}s` };
}

export default function Hero({ profile, socials }: HeroProps) {
  const landingLines = profile.landingText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lines = landingLines.length > 0 ? landingLines : [profile.landingText];

  const availability = profile.availabilityText.trim();
  const lastSpace = availability.lastIndexOf(" ");
  const availabilityHead =
    lastSpace === -1 ? availability : availability.slice(0, lastSpace);
  const availabilityTail =
    lastSpace === -1 ? "" : availability.slice(lastSpace + 1);

  const scrollToOverview = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const overview = document.getElementById("overview");
    if (!overview) {
      return;
    }

    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    overview.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const afterHeadline = 0.2 + lines.length * 0.09;

  return (
    <section
      className="relative -mt-nav overflow-hidden"
      style={{ paddingBottom: SPECTRUM_TAIL_HEIGHT }}
    >
      <div className="relative flex min-h-dvh flex-col">
        <HeroSpectrum />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_26%_40%,rgb(6_10_17/0.92),rgb(6_10_17/0.4)_55%,transparent_100%)]"
        />

        <div
          className={`${CONTAINER} relative flex flex-1 flex-col justify-center pt-[calc(var(--spacing-nav)+2.5rem)] pb-40 sm:pb-48`}
        >
          <div className="animate-fade-up" style={stagger(0.05)}>
            <Badge>
              <span className="whitespace-nowrap">
                {availabilityHead}
                {availabilityTail && (
                  <span className="hidden sm:inline"> {availabilityTail}</span>
                )}
              </span>
            </Badge>
          </div>

          <h1 className="text-display mt-7 text-white sm:mt-9">
            {lines.map((line, index) => (
              <span
                key={index}
                className="-mb-[0.1em] block overflow-hidden pb-[0.1em]"
              >
                <span
                  className={`animate-rise block ${
                    index < lines.length - 1
                      ? "bg-linear-to-br from-[#8affea] via-brand to-brand-dark bg-clip-text text-transparent"
                      : ""
                  }`}
                  style={stagger(0.15 + index * 0.09)}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="animate-fade-up mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:mt-9 sm:text-xl md:text-[1.375rem] md:leading-relaxed"
            style={stagger(afterHeadline)}
          >
            {profile.sloganText}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-6 sm:mt-11 sm:flex-row sm:items-center sm:gap-8"
            style={stagger(afterHeadline + 0.1)}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className={BUTTON_PRIMARY}>
                View Projects
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
              <Link href="/resume" className={BUTTON_SECONDARY}>
                View Resume
              </Link>
            </div>

            {socials && (
              <div className="sm:border-l sm:border-line sm:pl-8">
                {socials}
              </div>
            )}
          </div>
        </div>

        <a
          href="#overview"
          onClick={scrollToOverview}
          className="animate-fade-up group eyebrow absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-lg px-3 py-1 text-muted transition-colors hover:text-brand sm:bottom-10"
          style={stagger(afterHeadline + 0.5)}
        >
          Scroll
          <ArrowDown
            size={14}
            aria-hidden="true"
            className="animate-scroll-cue"
          />
        </a>
      </div>
    </section>
  );
}
