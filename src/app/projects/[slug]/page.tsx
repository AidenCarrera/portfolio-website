import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PortableText } from "next-sanity";
import { SiGithub } from "react-icons/si";
import ImageLightbox from "@/components/common/ImageLightbox";
import { getProjectBySlug, getRoutableProjects } from "@/lib/projects";
import { formatTagName } from "@/lib/utils";
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

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { github, content, presentation } = project;
  // Deleted or unresolved asset references come back as null from the deref,
  // so an image document can outlive the file it points at.
  const heroImage = content?.heroImage;
  const heroUrl = heroImage?.asset?.url;
  const heroDimensions = heroImage?.asset?.metadata?.dimensions;
  const heroLqip = heroImage?.asset?.metadata?.lqip;
  const galleryImages =
    content?.gallery?.filter((image) => image.asset?.url) ?? [];
  const createdDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(github.createdAt));
  const liveUrl =
    github.homepage && !github.homepage.startsWith("http")
      ? `https://${github.homepage}`
      : github.homepage;

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {presentation.featured && (
              <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
                Featured
              </span>
            )}
            {github.isCollab && (
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
                Collaborative
              </span>
            )}
            {content?.status && (
              <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
                {content.status}
              </span>
            )}
          </div>

          <h1 className="mb-5 text-4xl font-bold text-white sm:text-6xl">
            {presentation.repoName}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            {presentation.cardDescription}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-slate-500">
                Repository
              </dt>
              <dd className="mt-1 text-slate-200">
                {project.githubRepository}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-slate-500">
                Created
              </dt>
              <dd className="mt-1 text-slate-200">{createdDate}</dd>
            </div>
            {content?.role && (
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500">
                  Role
                </dt>
                <dd className="mt-1 text-slate-200">{content.role}</dd>
              </div>
            )}
            {content?.timeframe && (
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-500">
                  Timeframe
                </dt>
                <dd className="mt-1 text-slate-200">{content.timeframe}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={github.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <SiGithub size={18} />
              View repository
            </a>
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 font-semibold text-white transition-colors hover:border-brand/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <ExternalLink size={18} />
                View live project
              </a>
            )}
          </div>
        </header>

        {heroImage && heroUrl && (
          <figure className="mb-12 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
            <ImageLightbox
              image={heroImage}
              label={`View a larger image of ${presentation.repoName}`}
              className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
            >
              <Image
                src={heroUrl}
                // Fall back to empty alt for legacy documents to treat image as decorative.
                alt={heroImage.alt ?? ""}
                width={heroDimensions?.width ?? 1600}
                height={heroDimensions?.height ?? 900}
                // The article caps at max-w-5xl (64rem) less its lg padding.
                sizes="(min-width: 1024px) 960px, 100vw"
                placeholder={heroLqip ? "blur" : "empty"}
                blurDataURL={heroLqip}
                className="h-auto w-full object-cover"
                priority
              />
            </ImageLightbox>
            {heroImage.caption && (
              <figcaption className="px-5 py-3 text-sm text-slate-400">
                {heroImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {content?.highlights && content.highlights.length > 0 && (
          <section className="mb-12 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 sm:p-8">
            <h2 className="mb-5 text-2xl font-semibold text-white">
              Highlights
            </h2>
            <ul className="space-y-3 text-slate-300">
              {/* Highlights are free text and can repeat, so position is the
                  only stable key; the list is never reordered client side. */}
              {content.highlights.map((highlight, index) => (
                <li key={index} className="flex gap-3">
                  <span aria-hidden="true" className="text-brand">
                    •
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {content?.detailContent && content.detailContent.length > 0 && (
          <section className="mb-12 max-w-3xl space-y-5 text-base leading-8 text-slate-300 [&_a]:text-brand [&_a]:underline [&_h2]:pt-4 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:pt-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_li]:ml-5 [&_ol]:list-decimal [&_p]:text-slate-300 [&_ul]:list-disc">
            <PortableText value={content.detailContent} />
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-white">Gallery</h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {galleryImages.map((image, index) => {
                const dimensions = image.asset?.metadata?.dimensions;
                const lqip = image.asset?.metadata?.lqip;
                return (
                  // _key is the array member's own identity, so it survives the
                  // same asset being used twice in one gallery.
                  <li key={image._key ?? index}>
                    <figure className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                      <ImageLightbox
                        image={image}
                        label={`View a larger image of ${
                          image.alt?.trim() || `gallery image ${index + 1}`
                        }`}
                        className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                      >
                        <Image
                          src={image.asset.url}
                          alt={image.alt ?? ""}
                          width={dimensions?.width ?? 1200}
                          height={dimensions?.height ?? 800}
                          // Two columns from sm up, inside the same max-w-5xl
                          // article, less the 1.5rem grid gap.
                          sizes="(min-width: 1024px) 468px, (min-width: 640px) 50vw, 100vw"
                          placeholder={lqip ? "blur" : "empty"}
                          blurDataURL={lqip}
                          className="h-auto w-full object-cover"
                        />
                      </ImageLightbox>
                      {image.caption && (
                        <figcaption className="px-4 py-3 text-sm text-slate-400">
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

        <section className="border-t border-slate-800 pt-8">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-slate-500">
            GitHub topics
          </h2>
          <ul className="flex flex-wrap gap-2">
            {presentation.tags.map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {formatTagName(topic)}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
