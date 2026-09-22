import ArrowLink from "@/components/common/ArrowLink";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { CONTAINER } from "@/lib/styles";

interface CreatorBandProps {
  intro: string;
}

const BAR_COUNT = 72;
const RULER_MARKS = ["0:00", "0:15", "0:30", "0:45", "1:00", "1:15"];

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

const BARS = Array.from({ length: BAR_COUNT }, (_, index) => barHeight(index));

function Bars({ played }: { played: boolean }) {
  return (
    <div className="flex h-full items-center justify-between gap-px">
      {BARS.map((height, index) => (
        <span
          key={index}
          className={`animate-waveform flex-1 rounded-full ${
            played
              ? "bg-linear-to-t from-brand-dark to-brand shadow-[0_0_10px_rgb(0_255_204/0.35)]"
              : "bg-slate-500/25"
          }`}
          style={{
            height: `${height * 100}%`,
            animationDelay: `${(index % 18) * 0.11}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function CreatorBand({ intro }: CreatorBandProps) {
  return (
    <section
      aria-labelledby="music-heading"
      className={`${CONTAINER} py-20 sm:py-28`}
    >
      <Reveal>
        <div className="rounded-[2rem] border border-line bg-ink-850">
          <div className="grid items-center gap-12 p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
            <div className="lg:col-span-5">
              <SectionHeading title="Music" id="music-heading">
                {intro}
              </SectionHeading>
              <ArrowLink href="/music" className="mt-8">
                Take a listen
              </ArrowLink>
            </div>

            {/* A clip on a DAW timeline, playing. Decorative throughout. */}
            <div aria-hidden="true" className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-line bg-ink-950/80 shadow-[inset_0_2px_20px_rgb(0_0_0/0.5)]">
                <div className="relative px-4 pt-5 pb-6 sm:px-6">
                  <div className="mb-4 flex justify-between font-mono text-[0.625rem] text-slate-600">
                    {RULER_MARKS.map((mark, index) => (
                      <span
                        key={mark}
                        className={index % 2 === 1 ? "hidden sm:inline" : ""}
                      >
                        {mark}
                      </span>
                    ))}
                  </div>

                  <div className="relative h-28 sm:h-36">
                    <Bars played={false} />
                    {/* The played half: the same bars, lit, uncovered on the
                        playhead's clock so the two meet exactly. */}
                    <div className="animate-played absolute inset-0">
                      <Bars played />
                    </div>
                    {/* The full-width track is what animates; the line rides
                        its leading edge, since a transform percentage resolves
                        against the element it is applied to. */}
                    <div className="animate-playhead pointer-events-none absolute -inset-y-2 inset-x-0">
                      <div className="absolute inset-y-0 left-0 w-px bg-brand shadow-[0_0_14px_rgb(0_255_204/0.9)]">
                        <span className="absolute -top-1 -left-[3px] size-[7px] rotate-45 bg-brand" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
