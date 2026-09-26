import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArrowLink from "@/components/common/ArrowLink";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import ProjectLinks from "@/components/projects/ProjectLinks";
import ProjectMedia from "@/components/projects/ProjectMedia";
import type { PortfolioProject } from "@/lib/projects";
import { CHIP, CHIP_COLLAB, CONTAINER } from "@/lib/styles";
import { formatTagName } from "@/lib/utils";

interface FeaturedProjectsProps {
  projects: PortfolioProject[];
  intro: string;
}

// Half of the page container on the two-column grid, less the bezel.
const IMAGE_SIZES =
  "(min-width: 1280px) 580px, (min-width: 768px) calc(50vw - 3rem), calc(100vw - 3rem)";

// Enough to read the stack at a glance without the chips taking over.
const MAX_TAGS = 5;

function FeaturedProject({ project }: { project: PortfolioProject }) {
  const { github, presentation, slug } = project;

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        href={`/projects/${slug}`}
        className="absolute -inset-4 z-10 rounded-3xl"
        aria-label={`View project details for ${presentation.repoName}`}
      />

      <div className="rounded-[1.25rem] border border-line bg-ink-800/80 p-2 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] transition-colors duration-500 group-hover:border-brand/30">
        <ProjectMedia project={project} sizes={IMAGE_SIZES} />
      </div>

      <div className="pointer-events-none relative mt-8 flex flex-1 flex-col">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-brand sm:text-3xl">
          {presentation.repoName}
        </h3>
        <p className="mt-3 leading-relaxed text-slate-400">
          {presentation.cardDescription}
        </p>

        <ul className="mt-6 mb-8 flex flex-wrap gap-1.5">
          {github.isCollab && <li className={CHIP_COLLAB}>Collab</li>}
          {presentation.tags.slice(0, MAX_TAGS).map((tag) => (
            <li key={tag} className={CHIP}>
              {formatTagName(tag)}
            </li>
          ))}
          {presentation.tags.length > MAX_TAGS && (
            <li className="inline-flex items-center rounded-md border border-dashed border-line px-2 py-1 font-mono text-xs text-muted">
              +{presentation.tags.length - MAX_TAGS}
              <span className="sr-only"> more</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-6">
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-2 font-medium text-brand"
          >
            View project
            <ArrowRight
              size={16}
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            />
          </span>
          <ProjectLinks project={project} className="pointer-events-auto" />
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjects({
  projects,
  intro,
}: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-heading"
      className={`${CONTAINER} py-20 sm:py-28`}
    >
      <Reveal>
        <SectionHeading
          title="Featured Projects"
          id="featured-heading"
          action={<ArrowLink href="/projects">All projects</ArrowLink>}
        >
          {intro}
        </SectionHeading>
      </Reveal>

      <ol className="mt-16 grid gap-x-10 gap-y-20 sm:mt-20 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.github.url}>
            <Reveal className="h-full">
              <FeaturedProject project={project} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
