"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Music,
  Mic2,
  Speaker,
  Laptop,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import CategoryFilter from "@/components/projects/CategoryFilter";
import type { GearItemType, SanityGearItem } from "@/sanity/types";

interface GearSectionProps {
  gear: SanityGearItem[];
}

const TYPE_SECTIONS: Array<{
  type: GearItemType;
  title: string;
  icon: React.ReactNode;
}> = [
  { type: "instrument", title: "Instruments", icon: <Music size={24} /> },
  { type: "hardware", title: "Hardware", icon: <Mic2 size={24} /> },
  { type: "software", title: "Software", icon: <Laptop size={24} /> },
  {
    type: "instrumentPlugin",
    title: "Instrument Plugins",
    icon: <Music size={24} />,
  },
  {
    type: "mixingPlugin",
    title: "Mixing Plugins",
    icon: <Speaker size={24} />,
  },
];

// Plugins are listed as compact pills instead of image-led cards.
const PLUGIN_TYPES = new Set<GearItemType>([
  "instrumentPlugin",
  "mixingPlugin",
]);

function GearCard({
  item,
  layout,
  onView,
}: {
  item: SanityGearItem;
  layout: "rail" | "grid";
  onView: (item: SanityGearItem) => void;
}) {
  const image = item.image;
  // Deleted or unresolved asset references come back as null from the deref.
  const imageUrl = image?.asset?.url;
  const lqip = image?.asset?.metadata?.lqip;

  return (
    <li
      className={`group overflow-hidden rounded-xl border bg-slate-800/50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 ${
        layout === "rail" ? "w-56 shrink-0 snap-start sm:w-64" : "h-full"
      } ${
        item.featured
          ? "border-brand/30 hover:border-brand/60"
          : "border-slate-700 hover:border-brand/50"
      }`}
    >
      {imageUrl && (
        <button
          type="button"
          onClick={() => onView(item)}
          aria-label={`View a larger image of ${item.name}`}
          className="relative block aspect-square w-full bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        >
          <Image
            src={imageUrl}
            // Alt text is required by the schema, but older documents may
            // predate that rule; an empty string marks the photo decorative
            // rather than dropping the attribute, since the name sits below it.
            alt={image?.alt ?? ""}
            fill
            // Rail cards are w-56/sm:w-64; grid cards cap at the 17rem track
            // and only fall back to the viewport width below ~320px.
            sizes={
              layout === "rail"
                ? "(min-width: 640px) 256px, 224px"
                : "(min-width: 320px) 272px, 100vw"
            }
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            className="object-cover"
          />
        </button>
      )}
      <div className="p-4">
        <h4 className="font-semibold text-white transition-colors group-hover:text-brand">
          {item.name}
        </h4>
      </div>
    </li>
  );
}

/**
 * Full-size viewer for a gear photo. The native modal dialog supplies the
 * focus trap, the Escape handling and the top-layer stacking, so none of that
 * has to be reimplemented here.
 */
function GearLightbox({
  item,
  onClose,
}: {
  item: SanityGearItem | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item && !dialog.open) {
      dialog.showModal();
    } else if (!item && dialog.open) {
      dialog.close();
    }
  }, [item]);

  const image = item?.image;
  const imageUrl = image?.asset?.url;
  const dimensions = image?.asset?.metadata?.dimensions;
  const lqip = image?.asset?.metadata?.lqip;

  return (
    <dialog
      ref={dialogRef}
      // Fires for Escape and for close() alike, so the dialog can never end up
      // shut while the section still thinks an item is open.
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the backdrop and on the dialog's own padding both report
        // the dialog as their target; clicks on the figure do not.
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label={item ? `${item.name}, full size image` : undefined}
      // Preflight zeroes the margin the user agent uses to centre a dialog.
      className="m-auto max-h-dvh max-w-[100vw] bg-transparent p-4 backdrop:bg-slate-950/85"
    >
      {item && imageUrl && (
        <figure className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
          <Image
            src={imageUrl}
            alt={image?.alt ?? ""}
            width={dimensions?.width ?? 1200}
            height={dimensions?.height ?? 1200}
            sizes="(min-width: 1024px) 900px, 100vw"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            // Capped so the caption stays on screen on short viewports.
            className="h-auto max-h-[calc(100dvh-10rem)] w-auto max-w-full object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute top-3 right-3 rounded-lg border border-slate-700/50 bg-slate-900/80 p-2 text-slate-300 backdrop-blur-sm transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X size={18} />
          </button>
          <figcaption className="px-5 py-3 text-sm">
            <span className="font-semibold text-white">{item.name}</span>
            {image?.caption && (
              <span className="ml-2 text-slate-400">{image.caption}</span>
            )}
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

/** Horizontally swipeable rail of image-led gear cards. */
function GearCarousel({
  items,
  label,
  onView,
}: {
  items: SanityGearItem[];
  label: string;
  onView: (item: SanityGearItem) => void;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateBounds = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 1);
    // Rounded up by a pixel so a fully scrolled rail still reads as the end.
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [updateBounds, items]);

  const scrollByPage = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.8,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    // flex-col only to stop the rail's negative top margin from collapsing
    // through this wrapper, which would drag the chevrons out of position.
    <div className="relative flex flex-col">
      {/* Fades hint that the rail continues past the viewport edge. */}
      {!atStart && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-slate-900 to-transparent" />
      )}
      {!atEnd && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-slate-900 to-transparent" />
      )}

      {/*
        A focusable scroll container needs an accessible name so keyboard and
        screen reader users know what they have landed on; the list role also
        conveys how many items are in the rail.
      */}
      <ul
        ref={railRef}
        onScroll={updateBounds}
        tabIndex={0}
        aria-label={`${label} — scroll horizontally to browse`}
        // overflow-x forces overflow-y to compute to auto, so the cards' hover
        // lift and shadow are clipped at the top edge. The top padding gives
        // them room and the matching negative margin cancels it out, leaving
        // the rail exactly where it sat before.
        className="scrollbar-none -mt-2 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pt-2 pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {items.map((item) => (
          <GearCard key={item._id} item={item} layout="rail" onView={onView} />
        ))}
      </ul>

      {/* Pointer affordance for desktop; touch users swipe the rail directly. */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={atStart}
        aria-label={`Scroll ${label} left`}
        className="absolute top-1/2 left-2 z-20 hidden -translate-y-1/2 rounded-lg border border-slate-700/50 bg-slate-900/80 p-2 text-slate-300 backdrop-blur-sm transition-all hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-0 sm:block"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        disabled={atEnd}
        aria-label={`Scroll ${label} right`}
        className="absolute top-1/2 right-2 z-20 hidden -translate-y-1/2 rounded-lg border border-slate-700/50 bg-slate-900/80 p-2 text-slate-300 backdrop-blur-sm transition-all hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-0 sm:block"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function PluginList({ items }: { items: SanityGearItem[] }) {
  // Preserves the sortOrder-driven order the query already returns.
  const groups = new Map<string, SanityGearItem[]>();

  for (const item of items) {
    const category = item.category?.trim() || "Other";
    const categoryItems = groups.get(category) ?? [];
    categoryItems.push(item);
    groups.set(category, categoryItems);
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([category, categoryItems]) => (
        <div key={category}>
          <h4 className="mb-3 text-sm font-medium text-slate-300">{category}</h4>
          <ul className="flex flex-wrap gap-2">
            {categoryItems.map((item) => (
              <li
                key={item._id}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  item.featured
                    ? "border-brand/20 bg-brand/10 text-brand"
                    : "border-transparent bg-slate-700 text-slate-300"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function GearSection({ gear }: GearSectionProps) {
  const [activeType, setActiveType] = useState<GearItemType | "all">("all");
  const [viewedItem, setViewedItem] = useState<SanityGearItem | null>(null);

  const sections = useMemo(() => {
    const itemsByType = new Map<GearItemType, SanityGearItem[]>();

    for (const item of gear) {
      const typeItems = itemsByType.get(item.type) ?? [];
      typeItems.push(item);
      itemsByType.set(item.type, typeItems);
    }

    return TYPE_SECTIONS.map((section) => ({
      ...section,
      items: itemsByType.get(section.type) ?? [],
    })).filter((section) => section.items.length > 0);
  }, [gear]);

  const visibleSections =
    activeType === "all"
      ? sections
      : sections.filter((section) => section.type === activeType);

  const activeTitle =
    sections.find((section) => section.type === activeType)?.title ?? "All";

  return (
    <section>
      <div className="mb-8 flex items-center space-x-3">
        <Wrench className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Gear &amp; Software</h2>
      </div>

      {gear.length > 0 ? (
        <>
          <CategoryFilter
            categories={["All", ...sections.map((section) => section.title)]}
            selected={activeTitle.toLowerCase()}
            onSelect={(selected) => {
              const match = sections.find(
                (section) => section.title.toLowerCase() === selected,
              );
              setActiveType(match ? match.type : "all");
            }}
          />

          <div className="space-y-16">
            {visibleSections.map(({ type, title, icon, items }) => (
              <div key={type}>
                <div className="mb-6 flex items-center space-x-3 border-b border-slate-800 pb-2">
                  <span className="text-brand">{icon}</span>
                  <h3 className="text-2xl font-semibold text-slate-200">
                    {title}
                  </h3>
                </div>

                {/*
                  Rails keep the combined view scannable, but once a single
                  type is filtered to there is room to lay every item out at
                  once.
                */}
                {PLUGIN_TYPES.has(type) ? (
                  <PluginList items={items} />
                ) : activeType === "all" ? (
                  <GearCarousel
                    items={items}
                    label={title}
                    onView={setViewedItem}
                  />
                ) : (
                  // Column count is left to auto-fill: the 16rem floor against
                  // the page's 1216px content box lands on four per row at
                  // desktop widths and steps down naturally below that. The
                  // 17rem cap keeps cards near the rail's card width instead
                  // of stretching, and the min() guard stops the floor from
                  // overflowing narrow viewports.
                  <ul className="grid justify-center gap-6 grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),17rem))]">
                    {items.map((item) => (
                      <GearCard
                        key={item._id}
                        item={item}
                        layout="grid"
                        onView={setViewedItem}
                      />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-12 text-center">
          <Wrench size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400">Gear showcase coming soon.</p>
        </div>
      )}

      <GearLightbox item={viewedItem} onClose={() => setViewedItem(null)} />
    </section>
  );
}
