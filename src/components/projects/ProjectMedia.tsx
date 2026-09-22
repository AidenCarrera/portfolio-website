import Image from "next/image";
import CoverArt from "./CoverArt";
import type { PortfolioProject } from "@/lib/projects";
import { isAnimatedImage } from "@/lib/utils";

interface ProjectMediaProps {
  project: PortfolioProject;
  sizes: string;
  /** Rounding for the image itself; the caller owns any frame around it. */
  className?: string;
  priority?: boolean;
}

/**
 * A project's hero screenshot at 16:10, or generated cover art when it has
 * none, so every card keeps the same rhythm. Zooms slightly when an ancestor
 * `group` is hovered.
 */
export default function ProjectMedia({
  project,
  sizes,
  className = "rounded-xl",
  priority = false,
}: ProjectMediaProps) {
  const { content, presentation, slug } = project;
  // Deleted or unresolved asset references come back as null from the deref,
  // so a document can name a hero image that no longer has a file behind it.
  const heroImage = content?.heroImage;
  const heroUrl = heroImage?.asset?.url;
  const heroLqip = heroImage?.asset?.metadata?.lqip;

  return (
    <div
      className={`relative aspect-16/10 w-full overflow-hidden bg-ink-850 ${className}`}
    >
      {heroUrl ? (
        <Image
          src={heroUrl}
          // Fall back to empty alt for legacy documents to treat image as
          // decorative; the card's overlay link already names the project.
          alt={heroImage?.alt ?? ""}
          fill
          sizes={sizes}
          // Heroes are usually app screenshots, so the crop still has to hold
          // legible UI text at thumbnail scale; the default 75 does not.
          quality={90}
          placeholder={heroLqip ? "blur" : "empty"}
          blurDataURL={heroLqip}
          // Re-encoding a GIF flattens it to its first frame, so animated
          // heroes bypass the optimizer and stream from Sanity as-is.
          unoptimized={isAnimatedImage(heroImage)}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <CoverArt seed={slug} label={presentation.repoName} />
      )}
      {/* Hairline inner edge, so bright screenshots do not bleed out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]"
      />
    </div>
  );
}
