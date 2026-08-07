import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import Badge from "@/components/common/Badge";
import JsonLd from "@/components/common/JsonLd";
import PhotoGallery from "@/components/about/PhotoGallery";
import Portrait from "@/components/common/Portrait";
import { getAboutPage, splitParagraphs } from "@/lib/about";
import { getWebsiteProfile } from "@/lib/profile";
import { socialLinks } from "@/lib/socialLinks";
import { getAboutPageStructuredData } from "@/lib/structuredData";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();

  return {
    title: "About",
    description:
      about?.seoDescription?.trim() ||
      (about?.intro ? splitParagraphs(about.intro)[0] : undefined),
    alternates: {
      canonical: "/about",
    },
  };
}

const sectionHeadingClass = "text-2xl sm:text-3xl font-bold text-white";

const inlineLinkClass =
  "inline-flex items-center rounded-lg border border-brand/25 bg-brand/10 px-2.5 py-1 align-middle font-semibold text-brand transition-colors hover:border-brand/50 hover:bg-brand/15 hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

export default async function About() {
  const [about, profile] = await Promise.all([
    getAboutPage(),
    getWebsiteProfile(),
  ]);

  if (!about) {
    notFound();
  }

  const introParagraphs = splitParagraphs(about.intro);
  // The portrait sits beside the opening of the intro; whatever follows runs
  // the full width of the header underneath it.
  const leadParagraphs = introParagraphs.slice(0, 2);
  const remainingParagraphs = introParagraphs.slice(2);

  const metaItems = [
    { icon: MapPin, label: about.locationLabel },
    { icon: GraduationCap, label: about.graduationLabel },
    { icon: Briefcase, label: about.availabilityLabel },
  ].filter((item): item is { icon: typeof MapPin; label: string } =>
    Boolean(item.label),
  );

  const gitHubLink = socialLinks.find((link) => link.label === "GitHub");
  const linkedInLink = socialLinks.find((link) => link.label === "LinkedIn");

  const primaryLinkClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-dark to-brand-darker px-5 py-3 font-semibold text-white shadow-lg shadow-brand/10 transition-transform hover:-translate-y-0.5 hover:from-brand hover:to-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  const secondaryLinkClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/60 bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/10 transition-transform hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

  return (
    <div className="min-h-screen bg-slate-900 pt-8 pb-20">
      <JsonLd data={getAboutPageStructuredData(about, profile)} />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-800/50 p-6 shadow-2xl shadow-black/20 sm:p-10">
          {/* Three rows from lg up: the portrait spans the heading and the
              opening paragraphs beside it, then everything after runs the full
              width beneath it. Stacked, the same order reads heading, portrait,
              intro. */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-x-12 lg:gap-y-6">
            <div className="lg:col-start-1 lg:row-start-1">
              <div className="mb-5">
                <Badge>{about.eyebrow}</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {about.heading}
              </h1>
            </div>

            {/* self-start keeps the portrait at its own aspect ratio rather
                than stretching to whatever the rows beside it add up to. */}
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
              <Portrait
                portrait={about.portrait}
                name={profile.name}
                priority
              />
            </div>

            <div className="space-y-5 text-lg leading-relaxed text-slate-300 lg:col-start-1 lg:row-start-2">
              {leadParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-3">
              {remainingParagraphs.length > 0 && (
                <div className="space-y-5 text-lg leading-relaxed text-slate-300">
                  {remainingParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}

              {metaItems.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {metaItems.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-300"
                    >
                      <Icon
                        size={16}
                        className="text-brand"
                        aria-hidden="true"
                      />
                      {label}
                    </li>
                  ))}
                </ul>
              )}

              {(gitHubLink || linkedInLink) && (
                <div className="mt-8 flex flex-col gap-3 border-t border-slate-700/80 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
                  {gitHubLink && (
                    <a
                      href={gitHubLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={primaryLinkClass}
                    >
                      <gitHubLink.icon size={20} aria-hidden="true" />
                      GitHub
                    </a>
                  )}
                  {linkedInLink && (
                    <a
                      href={linkedInLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={secondaryLinkClass}
                    >
                      <linkedInLink.icon size={20} aria-hidden="true" />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mt-10 space-y-10">
          {about.gallery.length > 0 && (
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className={sectionHeadingClass}>
                {about.galleryHeading}
              </h2>
              {about.galleryIntro && (
                <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
                  {about.galleryIntro}
                </p>
              )}

              <div className="mt-6">
                <PhotoGallery photos={about.gallery} />
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 text-center sm:p-8">
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
              Explore my{" "}
              <Link href="/projects" className={inlineLinkClass}>
                Projects
              </Link>{" "}
              to see more of my work, or visit{" "}
              <Link href="/contact" className={inlineLinkClass}>
                Contact
              </Link>{" "}
              to get in touch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
