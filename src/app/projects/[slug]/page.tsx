import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PortableText } from "next-sanity";
import { SiGithub } from "react-icons/si";
import ImageLightbox from "@/components/common/ImageLightbox";
import Reveal from "@/components/common/Reveal";
import ProjectMedia from "@/components/projects/ProjectMedia";
import {
  getNextProjectInDisplayOrder,
  getProjectBySlug,
  getRoutableProjects,
} from "@/lib/projects";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CHIP,
  CHIP_BRAND,
  CHIP_COLLAB,
  CONTAINER,
  PROSE,
} from "@/lib/styles";
import { formatTagName, getLiveUrl, isAnimatedImage } from "@/lib/utils";
import type { SanityProject } from "@/sanity/types";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getRoutableProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.presentation.repoName,
    description: project.presentation.cardDescription,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

// One row on wide screens, however many facts the project has. Written out
// in full so Tailwind can see every class.
const SPEC_COLUMNS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

// Active work gets a lit LED; finished and archived work a dim one.
const STATUS_LED: Record<NonNullable<SanityProject["status"]>, string> = {
  Active: "bg-brand shadow-[0_0_8px_var(--color-brand)]",
  Complete: "bg-slate-400",
  Archived: "bg-slate-600",
};

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = await getNextProjectInDisplayOrder(project.slug);
  const { github, content, presentation } = project;
  // Deleted or unresolved asset references come back as null from the deref,
  // so an image document can outlive the file it points at.
  const heroImage = content?.heroImage;
  const heroUrl = heroImage?.asset?.url;
  const heroDimensions = heroImage?.asset?.metadata?.dimensions;
  const heroLqip = heroImage?.asset?.metadata?.lqip;
  const galleryImages =
    content?.gallery?.filter((image) => image.asset?.url) ?? [];
  const highlights = content?.highlights ?? [];
  const detailContent = content?.detailContent ?? [];
  const hasDetail = detailContent.length > 0;
  const createdDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(github.createdAt));
  const liveUrl = getLiveUrl(github.homepageUrl);

  const specs = [
    { term: "Repository", detail: project.githubRepository },
    { term: "Created", detail: createdDate },
    { term: "Role", detail: content?.role },
    { term: "Timeframe", detail: content?.timeframe },
  ].filter((spec): spec is { term: string; detail: string } =>
    Boolean(spec.detail),
  );

  const topics =
    presentation.tags.length > 0 ? (
      <div>
        <h2 className="eyebrow text-muted">GitHub topics</h2>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {presentation.tags.map((topic) => (
            <li key={topic} className={CHIP}>
              {formatTagName(topic)}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const highlightList =
    highlights.length > 0 ? (
      <section aria-labelledby="highlights-heading">
        <h2 id="highlights-heading" className="eyebrow text-muted">
          Highlights
        </h2>
        <ol className="mt-5 space-y-4">
          {/* Highlights are free text and can repeat, so position is the
              only stable key; the list is never reordered client side. */}
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="flex gap-4 border-t border-line pt-4 leading-relaxed text-slate-300"
            >
              <span className="eyebrow mt-1 text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ol>
      </section>
    ) : null;

  return (
    <article className="pb-24 sm:pb-32">
      <header>
        <div className={`${CONTAINER} pt-10 pb-12 sm:pt-14 sm:pb-16`}>
          <Reveal>
            <nav aria-label="Breadcrumb">
              <ol className="eyebrow flex items-center gap-2 text-muted">
                <li>
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-2 rounded-sm transition-colors hover:text-brand"
                  >
                    <ArrowLeft
                      size={13}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-x-0.5"
                    />
                    Projects
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-700">
                  /
                </li>
                <li aria-current="page" className="truncate text-slate-400">
                  {project.slug}
                </li>
              </ol>
            </nav>

            {(presentation.featured || github.isCollab || content?.status) && (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                {presentation.featured && (
                  <span className={CHIP_BRAND}>Featured</span>
                )}
                {github.isCollab && (
                  <span className={CHIP_COLLAB}>Collaborative</span>
                )}
                {content?.status && (
                  <span className="inline-flex items-center gap-2 rounded-md border border-line px-2 py-1 font-mono text-[0.625rem] font-medium tracking-[0.14em] text-slate-300 uppercase">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${STATUS_LED[content.status]}`}
                    />
                    {content.status}
                  </span>
                )}
              </div>
            )}

            <h1 className="text-title mt-6 break-words text-white">
              {presentation.repoName}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              {presentation.cardDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_PRIMARY}
              >
                <SiGithub size={17} aria-hidden="true" />
                View repository
              </a>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={BUTTON_SECONDARY}
                >
                  View live project
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      <div className={CONTAINER}>
        {/* Spec sheet: the facts about the repository. The one-pixel gaps
            over a hairline background rule it like a table at any count. */}
        <Reveal>
          <dl
            className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 ${
              SPEC_COLUMNS[specs.length] ?? ""
            }`}
          >
            {specs.map(({ term, detail }, index) => (
              <div
                key={term}
                className={`min-w-0 bg-ink-900 px-5 py-5 ${
                  specs.length % 2 === 1 && index === specs.length - 1
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <dt className="eyebrow text-muted">{term}</dt>
                <dd className="mt-2 truncate text-slate-200">{detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {heroImage && heroUrl && (
          <Reveal className="mt-12 sm:mt-16">
            <figure className="rounded-[1.5rem] border border-line bg-ink-800/80 p-2 shadow-[0_50px_100px_-50px_rgb(0_0_0/0.9)]">
              <ImageLightbox
                image={heroImage}
                label={`View a larger image of ${presentation.repoName}`}
                className="block w-full overflow-hidden rounded-2xl focus-visible:outline-offset-[-2px]"
              >
                <Image
                  src={heroUrl}
                  // Fall back to empty alt for legacy documents to treat image as decorative.
                  alt={heroImage.alt ?? ""}
                  width={heroDimensions?.width ?? 1600}
                  height={heroDimensions?.height ?? 900}
                  // The page container caps at max-w-7xl less its lg padding
                  // and the frame.
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  // Full-bleed screenshots at the top of the page; the default 75
                  // leaves visible ringing around UI text at this display size.
                  quality={90}
                  placeholder={heroLqip ? "blur" : "empty"}
                  blurDataURL={heroLqip}
                  // Re-encoding a GIF flattens it to its first frame, so animated
                  // heroes bypass the optimizer and stream from Sanity as-is.
                  unoptimized={isAnimatedImage(heroImage)}
                  className="h-auto w-full object-cover"
                  priority
                />
              </ImageLightbox>
              {heroImage.caption && (
                <figcaption className="px-4 pt-3 pb-2 text-sm text-slate-400">
                  {heroImage.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )}

        {(hasDetail || highlightList || topics) && (
          <div className="mt-16 grid gap-14 sm:mt-20 lg:grid-cols-12 lg:gap-16">
            {hasDetail ? (
              <>
                <Reveal className="lg:col-span-7">
                  <section className={PROSE}>
                    <PortableText value={detailContent} />
                  </section>
                </Reveal>
                {(highlightList || topics) && (
                  <aside className="lg:col-span-5">
                    <div className="space-y-12 lg:sticky lg:top-24">
                      {highlightList}
                      {topics}
                    </div>
                  </aside>
                )}
              </>
            ) : (
              <>
                {highlightList && (
                  <Reveal className="lg:col-span-7">{highlightList}</Reveal>
                )}
                {topics && (
                  <Reveal
                    className={
                      highlightList ? "lg:col-span-5" : "lg:col-span-12"
                    }
                  >
                    {topics}
                  </Reveal>
                )}
              </>
            )}
          </div>
        )}

        {galleryImages.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mt-20 sm:mt-28">
            <h2 id="gallery-heading" className="eyebrow text-muted">
              Gallery
            </h2>
            {/* Multi-column masonry: images keep their own aspect ratio and the
                columns fill top to bottom, so tall and wide shots pack together
                without the row-height gaps a grid would leave. These are
                thumbnails — every one opens full size in the lightbox. */}
            <ul className="mt-6 gap-5 sm:columns-2 lg:columns-3">
              {galleryImages.map((image, index) => {
                const dimensions = image.asset?.metadata?.dimensions;
                const lqip = image.asset?.metadata?.lqip;
                return (
                  // _key is the array member's own identity, so it survives the
                  // same asset being used twice in one gallery.
                  <li
                    key={image._key ?? index}
                    className="mb-5 break-inside-avoid"
                  >
                    <figure className="group overflow-hidden rounded-2xl border border-line bg-ink-800 transition-colors hover:border-brand/40">
                      <ImageLightbox
                        image={image}
                        label={`View a larger image of ${
                          image.alt?.trim() || `gallery image ${index + 1}`
                        }`}
                        className="block w-full overflow-hidden focus-visible:outline-offset-[-2px]"
                      >
                        <Image
                          src={image.asset.url}
                          alt={image.alt ?? ""}
                          width={dimensions?.width ?? 1200}
                          height={dimensions?.height ?? 800}
                          // Three columns across the page container from lg,
                          // two from sm, less its padding and the column gaps.
                          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          quality={90}
                          placeholder={lqip ? "blur" : "empty"}
                          blurDataURL={lqip}
                          // Re-encoding a GIF flattens it to its first frame, so
                          // animated shots bypass the optimizer as well.
                          unoptimized={isAnimatedImage(image)}
                          className="h-auto w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </ImageLightbox>
                      {image.caption && (
                        <figcaption className="border-t border-line px-4 py-3 text-sm text-slate-400">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <nav
          aria-label="Project navigation"
          className="mt-20 border-t border-line pt-10 sm:mt-28"
        >
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="relative panel group grid overflow-hidden rounded-[1.5rem] p-2 md:grid-cols-[1fr_minmax(0,26rem)]"
            >
              <div className="flex flex-col p-5 sm:p-8">
                <span className="eyebrow text-muted">Next project</span>
                <span className="mt-8 text-3xl font-semibold tracking-[-0.03em] break-words text-white transition-colors duration-300 group-hover:text-brand sm:text-4xl md:mt-auto">
                  {nextProject.presentation.repoName}
                </span>
                <span className="mt-3 line-clamp-2 max-w-xl text-slate-400">
                  {nextProject.presentation.cardDescription}
                </span>
                <span className="mt-6 inline-flex items-center gap-2 font-medium text-brand">
                  View project
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                  />
                </span>
              </div>
              <ProjectMedia
                project={nextProject}
                sizes="(min-width: 768px) 26rem, 100vw"
                className="order-first rounded-2xl md:order-last"
              />
            </Link>
          )}

          <Link
            href="/projects"
            className="group eyebrow mt-8 inline-flex items-center gap-2 rounded-sm text-slate-400 transition-colors hover:text-brand"
          >
            <ArrowLeft
              size={13}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            All projects
          </Link>
        </nav>
      </div>
    </article>
  );
}
