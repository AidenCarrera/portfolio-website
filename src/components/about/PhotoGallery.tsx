import Image from "next/image";
import { Camera } from "lucide-react";
import ImageLightbox from "@/components/common/ImageLightbox";
import Reveal from "@/components/common/Reveal";
import { isAnimatedImage } from "@/lib/utils";
import type { SanityImage } from "@/sanity/types";

interface PhotoGalleryProps {
  photos: SanityImage[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  // Deleted or unresolved asset references come back as null from the deref;
  // without a URL there is nothing to render or open.
  const visiblePhotos = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ photo }) => photo.asset?.url)
    .sort(
      (a, b) =>
        (a.photo.displayOrder ?? Number.MAX_SAFE_INTEGER) -
          (b.photo.displayOrder ?? Number.MAX_SAFE_INTEGER) ||
        a.index - b.index,
    )
    .map(({ photo }) => photo);

  if (visiblePhotos.length === 0) {
    return (
      <div className="panel rounded-2xl p-12 text-center">
        <Camera
          size={40}
          className="mx-auto mb-4 text-slate-600"
          aria-hidden="true"
        />
        <p className="text-slate-400">Photo gallery coming soon.</p>
      </div>
    );
  }

  return (
    // Row by row, so the order curated in the Studio reads left to right; a
    // masonry's column-first fill would scramble it.
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visiblePhotos.map((photo, index) => (
        <li key={photo._key ?? photo.asset._id}>
          <Reveal delay={(index % 3) * 0.06} className="h-full">
            <figure className="group relative h-full overflow-hidden rounded-2xl border border-line bg-ink-800">
              <ImageLightbox
                image={photo}
                label={`View a larger version of ${photo.alt || "this photo"}`}
                className="relative block aspect-4/3 w-full overflow-hidden focus-visible:outline-offset-[-2px]"
              >
                <Image
                  src={photo.asset.url}
                  alt={photo.alt ?? ""}
                  fill
                  // Three columns from lg, two from sm, one below that.
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  quality={90}
                  placeholder={photo.asset.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={photo.asset.metadata?.lqip}
                  // Keeps animated formats playing instead of showing the
                  // flattened first frame the optimizer would return.
                  unoptimized={isAnimatedImage(photo)}
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </ImageLightbox>
              {photo.caption && (
                // Laid over the photo's foot on a scrim, so the caption
                // reads on bright and dark shots alike.
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-950/90 via-ink-950/50 to-transparent px-4 pt-12 pb-3.5 text-sm font-medium text-slate-100">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
