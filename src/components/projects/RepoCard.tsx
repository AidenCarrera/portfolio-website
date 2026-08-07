import { ExternalLink, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import type { PortfolioProject } from "@/lib/projects";
import { formatTagName, isAnimatedImage } from "@/lib/utils";

// Matches the three-across grid on the projects page.
const DEFAULT_IMAGE_SIZES =
  "(min-width: 1280px) 342px, (min-width: 1024px) calc(33vw - 5rem), (min-width: 768px) calc(50vw - 4.5rem), calc(100vw - 5rem)";

interface RepoCardProps {
  project: PortfolioProject;
  /** Override when the card is laid out in a wider grid than the projects page. */
  imageSizes?: string;
}

export default function RepoCard({
  project,
  imageSizes = DEFAULT_IMAGE_SIZES,
}: RepoCardProps) {
  const { github, content, presentation, slug } = project;
  // Deleted or unresolved asset references come back as null from the deref,
  // so a document can name a hero image that no longer has a file behind it.
  const heroImage = content?.heroImage;
  const heroUrl = heroImage?.asset?.url;
  const heroLqip = heroImage?.asset?.metadata?.lqip;

  return (
    <li className="relative h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/60 transition-all group flex flex-col">
      <Link
        href={`/projects/${slug}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none"
        aria-label={`View project details for ${presentation.repoName}`}
      >
        <span className="sr-only">
          View project details for {presentation.repoName}
        </span>
      </Link>

      <div className="relative z-20 pointer-events-none mb-3 flex items-center justify-between gap-3">
        <h3 className="min-w-0 text-xl font-semibold text-white group-hover:text-brand transition-colors">
          {presentation.repoName}
        </h3>

        <div className="flex shrink-0 space-x-2 pointer-events-auto">
          <a
            href={github.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title="View GitHub Repository"
            aria-label={`View GitHub repository for ${presentation.repoName}`}
          >
            <SiGithub size={20} />
          </a>
          {github.homepage && github.homepage.trim() !== "" && (
            <a
              href={
                github.homepage.startsWith("http")
                  ? github.homepage
                  : `https://${github.homepage}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title="View Live Site"
              aria-label={`View live site for ${presentation.repoName}`}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Fixed aspect ratio so cards with and without media stay on the same
          rhythm across the grid; the placeholder keeps the folder motif that
          used to sit in the header. */}
      <div className="pointer-events-none relative mb-4 aspect-video w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/60">
        {heroUrl ? (
          <Image
            src={heroUrl}
            // Fall back to empty alt for legacy documents to treat image as
            // decorative; the card's overlay link already names the project.
            alt={heroImage?.alt ?? ""}
            fill
            sizes={imageSizes}
            // Heroes are usually app screenshots, so the card crop still has to
            // hold legible UI text at thumbnail scale; the default 75 does not.
            quality={90}
            placeholder={heroLqip ? "blur" : "empty"}
            blurDataURL={heroLqip}
            // Re-encoding a GIF flattens it to its first frame, so animated
            // heroes bypass the optimizer and stream from Sanity as-is.
            unoptimized={isAnimatedImage(heroImage)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand/10 to-transparent"
          >
            <Folder
              size={28}
              className="text-brand/70 filter drop-shadow-[0_2px_6px_rgba(0,255,204,0.25)]"
            />
          </div>
        )}
      </div>

      <p className="pointer-events-none text-slate-400 text-sm mb-4 line-clamp-3">
        {presentation.cardDescription}
      </p>

      <ul className="pointer-events-none flex flex-wrap gap-2">
        {presentation.featured && (
          <li className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
            Featured
          </li>
        )}
        {github.isCollab && (
          <li className="inline-flex items-center rounded-full border border-[#5aa8ff]/40 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5ab5ff]">
            Collab
          </li>
        )}
        {presentation.tags.map((tech) => (
          <li
            key={tech}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300"
          >
            {formatTagName(tech)}
          </li>
        ))}
      </ul>
    </li>
  );
}
