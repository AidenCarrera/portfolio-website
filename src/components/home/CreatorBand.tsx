import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

interface CreatorBandProps {
  heading: string;
  intro: string;
}

const BAR_COUNT = 72;

// Deterministic envelope: a slow swell crossed with two faster partials, so the
// shape reads like a mixed-down waveform and matches between server and client.
function barHeight(index: number): number {
  const position = index / (BAR_COUNT - 1);
  const swell = Math.sin(position * Math.PI) ** 0.7;
  const detail =
    0.55 +
    0.28 * Math.sin(position * 34 + 1.2) +
    0.17 * Math.sin(position * 71 + 0.4);

  return Math.max(0.12, Math.min(1, swell * detail));
}

export default function CreatorBand({ heading, intro }: CreatorBandProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6 sm:pb-24 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-800/40 p-6 shadow-2xl shadow-black/20 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {heading}
              </h2>

              {intro && (
                <p className="mt-4 leading-relaxed text-slate-400">{intro}</p>
              )}

              <Link
                href="/music"
                className="group mt-6 inline-flex items-center gap-2 rounded font-semibold text-brand transition-colors hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Take a listen
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 px-4 py-6 shadow-inner sm:px-6">
                <div
                  aria-hidden="true"
                  className="flex h-28 items-center justify-between gap-px sm:h-32"
                >
                  {Array.from({ length: BAR_COUNT }, (_, index) => {
                    const height = barHeight(index);

                    return (
                      <span
                        key={index}
                        className="animate-waveform flex-1 rounded-full bg-linear-to-t from-brand-dark/70 to-brand"
                        style={{
                          height: `${height * 100}%`,
                          animationDelay: `${(index % 18) * 0.11}s`,
                          opacity: 0.35 + height * 0.5,
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  aria-hidden="true"
                  className="animate-playhead pointer-events-none absolute inset-y-0 w-px bg-brand/60 shadow-[0_0_12px_rgba(0,255,204,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
