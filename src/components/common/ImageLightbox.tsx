"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { SanityImage } from "@/sanity/types";

interface ImageLightboxProps {
  image: SanityImage;
  /** Accessible trigger label describing image content (replaces thumbnail alt text). */
  label: string;
  /** Bolded lead-in for the viewer's caption, above any authored caption. */
  title?: string;
  /** Classes for the trigger, which is otherwise an unstyled button. */
  className?: string;
  /** The thumbnail to wrap. */
  children: ReactNode;
}

/** Thumbnail trigger opening full-size image in a native modal dialog. */
export default function ImageLightbox({
  image,
  label,
  title,
  className,
  children,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Deleted or unresolved asset references come back as null from the deref;
  // the thumbnail still renders, it just is not clickable.
  const imageUrl = image.asset?.url;
  if (!imageUrl) return <>{children}</>;

  const dimensions = image.asset.metadata?.dimensions;
  const lqip = image.asset.metadata?.lqip;
  const viewerName = title ?? (image.alt?.trim() || "Image");

  const intrinsicWidth = dimensions?.width ?? 1200;
  const intrinsicHeight = dimensions?.height ?? 1200;
  // Vertical space the frame needs on top of the image itself.
  const captionReserve = title || image.caption ? "3rem" : "0rem";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={label}
        className={className}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        // Fires for Escape and for close() alike, so the dialog can never end
        // up shut while this component still thinks it is open.
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          // Clicks on the backdrop and on the dialog's own padding both report
          // the dialog as their target; clicks on the figure do not.
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        aria-label={`${viewerName}, full size image`}
        // Sets viewport dimensions and restores native dialog centering with `m-auto`.
        // `open:` keeps the display change behind the open state; a bare `grid`
        // beats the UA `dialog:not([open]){display:none}`, leaving a closed
        // 100dvw dialog in flow that overflows the page by the scrollbar width.
        className="m-auto open:grid h-dvh max-h-dvh w-dvw max-w-dvw place-items-center bg-transparent p-4 backdrop:bg-slate-950/85"
      >
        {isOpen && (
          <figure
            // Aspect-ratio width fills the viewer consistently—preventing narrow/wide images from looking 
            // stranded mid-screen—while 72rem/82dvh caps preserve viewport margins.
            style={{
              maxWidth: `min(72rem, calc((82dvh - ${captionReserve}) * ${intrinsicWidth / intrinsicHeight}))`,
            }}
            className="relative w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
          >
            <Image
              src={imageUrl}
              alt={image.alt ?? ""}
              width={intrinsicWidth}
              height={intrinsicHeight}
              // No sizes: the frame never exceeds the intrinsic width, so the
              // 1x/2x srcset Next derives from it is already the right ladder.
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
              className="h-auto w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close image viewer"
              className="absolute top-3 right-3 rounded-lg border border-slate-700/50 bg-slate-900/80 p-2 text-slate-300 backdrop-blur-sm transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <X size={18} />
            </button>
            {(title || image.caption) && (
              <figcaption className="px-5 py-3 text-sm">
                {title && (
                  <span className="font-semibold text-white">{title}</span>
                )}
                {image.caption && (
                  <span className={`text-slate-400 ${title ? "ml-2" : ""}`}>
                    {image.caption}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        )}
      </dialog>
    </>
  );
}
