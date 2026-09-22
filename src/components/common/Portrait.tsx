import Image from "next/image";
import { isAnimatedImage } from "@/lib/utils";
import type { SanityImage } from "@/sanity/types";

interface PortraitProps {
  portrait?: SanityImage;
  /** Used for the monogram shown until a portrait is uploaded. */
  name: string;
  /** Sizes the wrapper; the frame inside it keeps the 5:7 crop either way. */
  className?: string;
  /** Shapes the frame: 5:7 unless a layout needs it to fill a set height. */
  frameClassName?: string;
  sizes?: string;
  priority?: boolean;
}

const DEFAULT_CLASS_NAME = "mx-auto w-full max-w-88 sm:max-w-104 lg:max-w-88";
// Capped slightly below the surrounding layout at each breakpoint.
const DEFAULT_SIZES =
  "(min-width: 1024px) 22rem, (min-width: 640px) 26rem, 22rem";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function Portrait({
  portrait,
  name,
  className = DEFAULT_CLASS_NAME,
  frameClassName = "aspect-5/7",
  sizes = DEFAULT_SIZES,
  priority = false,
}: PortraitProps) {
  // Deleted or unresolved asset references come back as null from the deref.
  const imageUrl = portrait?.asset?.url;
  const lqip = portrait?.asset?.metadata?.lqip;

  return (
    <div className={className}>
      <div
        className={`relative ${frameClassName} overflow-hidden rounded-xl border border-line bg-ink-800 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]`}
      >
        {portrait && imageUrl ? (
          <Image
            src={imageUrl}
            alt={portrait.alt ?? `Portrait of ${name}`}
            fill
            sizes={sizes}
            quality={90}
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            unoptimized={isAnimatedImage(portrait)}
            priority={priority}
            className="object-cover"
          />
        ) : (
          // Placeholder until a portrait is uploaded in the Studio. Purely
          // decorative, so it stays out of the accessibility tree.
          <div
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-ink-700 to-ink-900"
            aria-hidden="true"
          >
            <span className="font-mono text-5xl font-bold tracking-widest text-brand/60 lg:text-6xl">
              {getInitials(name)}
            </span>
          </div>
        )}
        {/* A faint inner edge so light photos do not bleed into the page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]"
        />
      </div>
    </div>
  );
}
