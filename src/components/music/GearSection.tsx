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
  Piano,
  type LucideIcon,
} from "lucide-react";
import CategoryFilter from "@/components/common/CategoryFilter";
import ImageLightbox from "@/components/common/ImageLightbox";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { CHIP, CHIP_ACCENT } from "@/lib/styles";
import { isAnimatedImage } from "@/lib/utils";
import type { GearItemType, SanityGearItem } from "@/sanity/types";

interface GearSectionProps {
  gear: SanityGearItem[];
}

const TYPE_SECTIONS: Array<{
  type: GearItemType;
  title: string;
  icon: LucideIcon;
}> = [
  { type: "instrument", title: "Instruments", icon: Music },
  { type: "hardware", title: "Hardware", icon: Mic2 },
  { type: "software", title: "Software", icon: Laptop },
  { type: "instrumentPlugin", title: "Instrument Plugins", icon: Piano },
  { type: "mixingPlugin", title: "Mixing Plugins", icon: Speaker },
];

// Plugins are listed as compact pills instead of image-led cards.
const PLUGIN_TYPES = new Set<GearItemType>([
  "instrumentPlugin",
  "mixingPlugin",
]);

const railButtonClass =
  "absolute top-[40%] z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink-900/85 text-slate-300 shadow-lg backdrop-blur-md transition-all hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-0 sm:flex";

function GearCard({
  item,
  layout,
}: {
  item: SanityGearItem;
  layout: "rail" | "grid";
}) {
  const image = item.image;
  // Deleted or unresolved asset references come back as null from the deref.
  const imageUrl = image?.asset?.url;
  const lqip = image?.asset?.metadata?.lqip;

  return (
    <li
      className={`relative panel group rounded-2xl p-2 transition-transform duration-500 ease-out-expo hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${
        layout === "rail" ? "w-56 shrink-0 snap-start sm:w-64" : "h-full"
      }`}
    >
      {image && imageUrl && (
        <ImageLightbox
          image={image}
          title={item.name}
          label={`View a larger image of ${item.name}`}
          className="relative block aspect-square w-full overflow-hidden rounded-xl bg-white focus-visible:outline-offset-[-2px]"
        >
          <Image
            src={imageUrl}
            // Empty alt fallback marks legacy photos as decorative since name is shown below.
            alt={image?.alt ?? ""}
            fill
            // Rail cards are w-56/sm:w-64; grid cards cap at the 17rem track
            // and only fall back to the viewport width below ~320px.
            sizes={
              layout === "rail"
                ? "(min-width: 640px) 256px, 224px"
                : "(min-width: 320px) 272px, 100vw"
            }
            quality={90}
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            // The lightbox already bypasses the optimizer for GIFs; without the
            // same check here the thumbnail sits frozen on its first frame
            // until opened.
            unoptimized={isAnimatedImage(image)}
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </ImageLightbox>
      )}
      <div className="flex items-center justify-between gap-2 px-2.5 pt-3.5 pb-2">
        <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-brand">
          {item.name}
        </h4>
        {item.featured && (
          <span
            aria-label="Featured"
            className="size-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"
          />
        )}
      </div>
    </li>
  );
}

/** Horizontally swipeable rail of image-led gear cards. */
function GearCarousel({
  items,
  label,
}: {
  items: SanityGearItem[];
  label: string;
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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-ink-900 to-transparent" />
      )}
      {!atEnd && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-ink-900 to-transparent" />
      )}

      <ul
        ref={railRef}
        onScroll={updateBounds}
        tabIndex={0}
        aria-label={`${label} — scroll horizontally to browse`}
        // Counter-margin padding keeps the cards' hover lift from clipping.
        className="scrollbar-none -mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-2xl pt-2 pb-2"
      >
        {items.map((item) => (
          <GearCard key={item._id} item={item} layout="rail" />
        ))}
      </ul>

      {/* Pointer affordance for desktop; touch users swipe the rail directly. */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={atStart}
        aria-label={`Scroll ${label} left`}
        className={`${railButtonClass} left-3`}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        disabled={atEnd}
        aria-label={`Scroll ${label} right`}
        className={`${railButtonClass} right-3`}
      >
        <ChevronRight size={18} aria-hidden="true" />
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
    <dl className="divide-y divide-line border-y border-line">
      {Array.from(groups.entries()).map(([category, categoryItems]) => (
        <div
          key={category}
          className="grid gap-3 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8"
        >
          <dt className="text-sm font-medium text-slate-300">{category}</dt>
          <dd>
            <ul className="flex flex-wrap gap-1.5">
              {categoryItems.map((item) => (
                <li
                  key={item._id}
                  className={item.featured ? CHIP_ACCENT : CHIP}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function GearSection({ gear }: GearSectionProps) {
  const [activeType, setActiveType] = useState<GearItemType | "all">("all");

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

  const categories = useMemo(
    () => [
      { value: "all", label: "All", count: gear.length },
      ...sections.map((section) => ({
        value: section.type,
        label: section.title,
        count: section.items.length,
      })),
    ],
    [gear.length, sections],
  );

  return (
    <section aria-labelledby="gear-heading">
      <Reveal>
        <SectionHeading title="Gear & Software" id="gear-heading" />
      </Reveal>

      {gear.length > 0 ? (
        <>
          <div className="mt-10">
            <CategoryFilter
              categories={categories}
              selected={activeType}
              label="Filter gear by type"
              onSelect={(selected) => {
                const match = sections.find(
                  (section) => section.type === selected,
                );
                setActiveType(match ? match.type : "all");
              }}
            />
          </div>

          <div className="mt-12 space-y-16">
            {visibleSections.map(({ type, title, icon: Icon, items }) => (
              <div key={type}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-brand/20 bg-brand/[0.07] text-brand">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {title}
                  </h3>
                </div>

                {PLUGIN_TYPES.has(type) ? (
                  <PluginList items={items} />
                ) : activeType === "all" ? (
                  <GearCarousel items={items} label={title} />
                ) : (
                  // Auto-fill grid (16-17rem range) yields 4 columns on desktop, scaling cleanly down.
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),17rem))] justify-center gap-4">
                    {items.map((item) => (
                      <GearCard key={item._id} item={item} layout="grid" />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="panel mt-12 rounded-2xl p-12 text-center">
          <Wrench
            size={40}
            className="mx-auto mb-4 text-slate-600"
            aria-hidden="true"
          />
          <p className="text-slate-400">Gear showcase coming soon.</p>
        </div>
      )}
    </section>
  );
}
