import Link from "next/link";
import ProjectLinks from "./ProjectLinks";
import ProjectMedia from "./ProjectMedia";
import type { PortfolioProject } from "@/lib/projects";
import { CHIP, CHIP_BRAND, CHIP_COLLAB } from "@/lib/styles";
import { formatTagName } from "@/lib/utils";

// Matches the three-across grid on the projects page, less the card padding.
const DEFAULT_IMAGE_SIZES =
  "(min-width: 1280px) 400px, (min-width: 1024px) calc(33vw - 3rem), (min-width: 768px) calc(50vw - 3rem), calc(100vw - 3rem)";

interface RepoCardProps {
  project: PortfolioProject;
  /** Override when the card is laid out in a wider grid than the projects page. */
  imageSizes?: string;
}

export default function RepoCard({
  project,
  imageSizes = DEFAULT_IMAGE_SIZES,
}: RepoCardProps) {
  const { github, presentation, slug } = project;
  const year = new Date(github.createdAt).getUTCFullYear();

  return (
    <article className="relative panel group flex h-full flex-col rounded-[1.25rem] p-2 transition-transform duration-500 ease-out-expo hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <Link
        href={`/projects/${slug}`}
        className="absolute inset-0 z-10 rounded-[inherit]"
        aria-label={`View project details for ${presentation.repoName}`}
      />

      <ProjectMedia project={project} sizes={imageSizes} />

      <div className="pointer-events-none flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="eyebrow mr-1 text-muted">{year}</span>
            {presentation.featured && (
              <span className={CHIP_BRAND}>Featured</span>
            )}
            {github.isCollab && <span className={CHIP_COLLAB}>Collab</span>}
          </div>
          <ProjectLinks project={project} className="pointer-events-auto" />
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-brand">
          {presentation.repoName}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
          {presentation.cardDescription}
        </p>

        {presentation.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {presentation.tags.map((tag) => (
              <li key={tag} className={CHIP}>
                {formatTagName(tag)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
