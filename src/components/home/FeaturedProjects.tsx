import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RepoCard from "@/components/projects/RepoCard";
import Reveal from "./Reveal";
import SectionIntro from "./SectionIntro";
import type { PortfolioProject } from "@/lib/projects";

interface FeaturedProjectsProps {
  projects: PortfolioProject[];
  intro: string;
}

// Two across in the standard container, so each card is roughly half again as
// wide as one on the projects page.
const IMAGE_SIZES =
  "(min-width: 1024px) 480px, (min-width: 768px) calc(50vw - 4rem), calc(100vw - 5rem)";

export default function FeaturedProjects({
  projects,
  intro,
}: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal>
        <SectionIntro
          title="Featured Projects"
          action={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded font-semibold text-brand transition-colors hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              All projects
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          }
        >
          {intro}
        </SectionIntro>
      </Reveal>

      <Reveal>
        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <RepoCard
              key={project.github.html_url}
              project={project}
              imageSizes={IMAGE_SIZES}
            />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
