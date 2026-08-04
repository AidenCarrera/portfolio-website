import Image from "next/image";
import { Camera } from "lucide-react";
import ImageLightbox from "@/components/common/ImageLightbox";
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
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-12 text-center">
        <Camera size={48} className="mx-auto mb-4 text-slate-600" />
        <p className="text-slate-400">Photo gallery coming soon.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visiblePhotos.map((photo) => (
        <li key={photo._key ?? photo.asset._id}>
          <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 transition-colors hover:border-brand/50">
            <ImageLightbox
              image={photo}
              label={`View a larger version of ${photo.alt || "this photo"}`}
              className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
            >
              <Image
                src={photo.asset.url}
                alt={photo.alt ?? ""}
                fill
                // Three 21rem-ish columns from lg, two from sm, one below that.
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
                quality={90}
                placeholder={photo.asset.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={photo.asset.metadata?.lqip}
                // Keeps animated formats playing instead of showing the
                // flattened first frame the optimizer would return.
                unoptimized={isAnimatedImage(photo)}
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </ImageLightbox>
            {photo.caption && (
              <figcaption className="px-4 py-3 text-sm leading-relaxed text-slate-300">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
}
