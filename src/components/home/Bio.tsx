import ArrowLink from "@/components/common/ArrowLink";
import Parallax from "@/components/common/Parallax";
import Portrait from "@/components/common/Portrait";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { CONTAINER } from "@/lib/styles";
import type { SanityImage } from "@/sanity/types";

interface BioProps {
  paragraphs: string[];
  name: string;
  portrait?: SanityImage;
}

// Tracks the portrait column below, which is narrower than the page container.
const PORTRAIT_SIZES =
  "(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 16rem";

export default function Bio({ paragraphs, name, portrait }: BioProps) {
  const [lead, ...rest] = paragraphs;

  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className={`${CONTAINER} scroll-mt-20 py-20 sm:py-28`}
    >
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <SectionHeading title="About Me" id="overview-heading" />

          {lead && (
            <p className="mt-8 text-xl leading-relaxed text-slate-200 sm:text-2xl sm:leading-relaxed">
              {lead}
            </p>
          )}
          {rest.length > 0 && (
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-400">
              {rest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}

          <ArrowLink href="/about" className="mt-9">
            Read full about
          </ArrowLink>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <Parallax distance={50}>
            <Portrait
              portrait={portrait}
              name={name}
              className="mx-auto w-full max-w-64 sm:max-w-80 lg:max-w-96"
              sizes={PORTRAIT_SIZES}
            />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
