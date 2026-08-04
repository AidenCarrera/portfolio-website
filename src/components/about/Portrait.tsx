import Image from "next/image";
import { isAnimatedImage } from "@/lib/utils";
import type { SanityImage } from "@/sanity/types";

interface PortraitProps {
  portrait?: SanityImage;
  /** Used for the monogram shown until a portrait is uploaded. */
  name: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function Portrait({ portrait, name }: PortraitProps) {
  // Deleted or unresolved asset references come back as null from the deref.
  const imageUrl = portrait?.asset?.url;
  const lqip = portrait?.asset?.metadata?.lqip;

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      {/* A slightly shorter portrait crop at every width, on the same corner
          radius as the cards elsewhere on the site. */}
      <div className="relative aspect-[5/7] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/30">
        {portrait && imageUrl ? (
          <Image
            src={imageUrl}
            alt={portrait.alt ?? `Portrait of ${name}`}
            fill
            // Capped at 24rem/28rem while stacked, then the 24rem header column.
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 28rem, 24rem"
            quality={90}
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            unoptimized={isAnimatedImage(portrait)}
            priority
            className="object-cover"
          />
        ) : (
          // Placeholder until a portrait is uploaded in the Studio. Purely
          // decorative, so it stays out of the accessibility tree.
          <div
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-800 to-slate-900"
            aria-hidden="true"
          >
            <span className="font-mono text-5xl font-bold tracking-widest text-brand/60 lg:text-6xl">
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
