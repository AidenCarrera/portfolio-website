import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import JsonLd from "@/components/common/JsonLd";
import PhotoGallery from "@/components/about/PhotoGallery";
import Portrait from "@/components/common/Portrait";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { getAboutPage, splitParagraphs } from "@/lib/about";
import { getWebsiteProfile } from "@/lib/profile";
import { socialLinks } from "@/lib/socialLinks";
import { getAboutPageStructuredData } from "@/lib/structuredData";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CONTAINER } from "@/lib/styles";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();

  return {
    title: "About",
    description:
      about.seoDescription?.trim() || splitParagraphs(about.intro)[0],
    alternates: {
      canonical: "/about",
    },
  };
}

// Tracks the portrait's widths below: a fixed column from lg, stacked and
// capped under it.
const PORTRAIT_SIZES =
  "(min-width: 1280px) 24rem, (min-width: 1024px) 22rem, (min-width: 640px) 26rem, 22rem";

interface MetaItem {
  icon: LucideIcon;
  caption: string;
  label: string;
}

export default async function About() {
  const [about, profile] = await Promise.all([
    getAboutPage(),
    getWebsiteProfile(),
  ]);

  const introParagraphs = splitParagraphs(about.intro);
  // The first three paragraphs stand beside the portrait; the rest run the
  // full width beneath it.
  const [leadParagraph, ...sideParagraphs] = introParagraphs.slice(0, 3);
  const remainingParagraphs = introParagraphs.slice(3);

  const metaItems = [
    { icon: MapPin, caption: "Location", label: about.locationLabel },
    {
      icon: GraduationCap,
      caption: "Education",
      label: about.graduationLabel,
    },
    {
      icon: Briefcase,
      caption: "Availability",
      label: about.availabilityLabel,
    },
  ].filter((item): item is MetaItem => Boolean(item.label));

  const gitHubLink = socialLinks.find((link) => link.label === "GitHub");
  const linkedInLink = socialLinks.find((link) => link.label === "LinkedIn");

  const profileLinks =
    gitHubLink || linkedInLink ? (
      <div className="flex flex-col gap-3 sm:flex-row">
        {gitHubLink && (
          <a
            href={gitHubLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={BUTTON_PRIMARY}
          >
            <gitHubLink.icon size={18} aria-hidden="true" />
            GitHub
          </a>
        )}
        {linkedInLink && (
          <a
            href={linkedInLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={BUTTON_SECONDARY}
          >
            <linkedInLink.icon size={18} aria-hidden="true" />
            LinkedIn
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        )}
      </div>
    ) : null;

  return (
    <div className="pb-24 sm:pb-32">
      <JsonLd data={getAboutPageStructuredData(about, profile)} />

      <div className={`${CONTAINER} pt-14 pb-16 sm:pt-20 sm:pb-24`}>
        <header>
          <Reveal>
            <h1 className="text-title text-white">{about.heading}</h1>
          </Reveal>
        </header>

        {/* From lg up the portrait stands beside the first three paragraphs
            and stretches to their height, so the story carries on full width
            beneath it without a paragraph splitting at the photo's edge.
            Stacked, the order reads heading, portrait, story. */}
        <div className="mt-10 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <Reveal
            delay={0.1}
            className="mx-auto w-full max-w-88 sm:max-w-104 lg:order-last lg:max-w-none"
          >
            <Portrait
              portrait={about.portrait}
              name={profile.name}
              className="w-full lg:h-full"
              frameClassName="aspect-5/7 lg:aspect-auto lg:h-full lg:min-h-96"
              sizes={PORTRAIT_SIZES}
              priority
            />
          </Reveal>

          <Reveal>
            {leadParagraph && (
              <p className="text-xl leading-relaxed text-slate-200 sm:text-2xl sm:leading-relaxed">
                {leadParagraph}
              </p>
            )}
            {sideParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-6 text-lg leading-relaxed text-slate-400"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        {(remainingParagraphs.length > 0 || profileLinks) && (
          <Reveal className="mt-8">
            <div className="space-y-6 text-lg leading-relaxed text-slate-400">
              {remainingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {profileLinks && <div className="mt-10">{profileLinks}</div>}
          </Reveal>
        )}
      </div>

      <div className={CONTAINER}>
        {metaItems.length > 0 && (
          <Reveal>
            {/* Ruled above and below rather than boxed, so a value that wraps
                does not leave its neighbours' cells looking empty. */}
            <dl
              className={`grid gap-7 border-y border-line py-8 sm:py-10 md:gap-12 ${
                metaItems.length === 3
                  ? "md:grid-cols-3"
                  : metaItems.length === 2
                    ? "md:grid-cols-2"
                    : ""
              }`}
            >
              {metaItems.map(({ icon: Icon, caption, label }) => (
                <div key={caption} className="min-w-0">
                  <dt className="eyebrow flex items-center gap-2 text-muted">
                    <Icon size={14} aria-hidden="true" className="text-brand" />
                    {caption}
                  </dt>
                  <dd className="mt-3 text-lg leading-snug text-white">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {about.gallery.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mt-24 sm:mt-32">
            <Reveal>
              <SectionHeading
                title={about.galleryHeading ?? "Gallery"}
                id="gallery-heading"
              >
                {about.galleryIntro}
              </SectionHeading>
            </Reveal>

            <div className="mt-12">
              <PhotoGallery photos={about.gallery} />
            </div>
          </section>
        )}

        <Reveal className="mt-24 sm:mt-32">
          <section
            aria-labelledby="explore-heading"
            className="flex flex-col gap-10 rounded-[2rem] border border-line bg-ink-850 px-6 py-14 sm:px-12 sm:py-16 md:flex-row md:items-end md:justify-between lg:px-16"
          >
            <div className="max-w-xl">
              <h2 id="explore-heading" className="text-heading text-white">
                Keep exploring
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                See what I&rsquo;ve been building, or reach out about a role or
                a project.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/projects" className={BUTTON_PRIMARY}>
                View Projects
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
              <Link href="/contact" className={BUTTON_SECONDARY}>
                Get in touch
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
