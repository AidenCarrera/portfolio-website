import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Portrait from "@/components/common/Portrait";
import type { SanityImage } from "@/sanity/types";
import Reveal from "./Reveal";

interface BioProps {
  paragraphs: string[];
  name: string;
  portrait?: SanityImage;
}

// Tracks the portrait column below, which is narrower than the page container.
const PORTRAIT_SIZES =
  "(min-width: 1024px) 19rem, (min-width: 640px) 15rem, 14rem";

export default function Bio({ paragraphs, name, portrait }: BioProps) {
  return (
    <section
      id="overview"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8"
    >
      <Reveal>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm transition-colors hover:border-brand/50 sm:p-8">
          {/* items-center splits the leftover height above and below the copy
              rather than pooling it under the link, and keeps the photo on its
              5:7 ratio: grid items stretch by default, overriding the aspect
              box. */}
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
            <Portrait
              portrait={portrait}
              name={name}
              className="order-first mx-auto w-full max-w-56 sm:order-last sm:mx-0 sm:max-w-none"
              sizes={PORTRAIT_SIZES}
            />

            {/* Capping the measure leaves a gutter before the portrait, so no
                line can run up against it. */}
            <div className="lg:max-w-xl">
              <h2 className="text-[1.75rem] font-bold tracking-tight text-white sm:text-[2rem]">
                About Me
              </h2>

              <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-300">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <Link
                href="/about"
                className="group mt-6 inline-flex items-center gap-2 self-start rounded font-semibold text-brand transition-colors hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Read full about
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
