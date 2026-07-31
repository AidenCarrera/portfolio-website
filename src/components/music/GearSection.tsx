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
}: {
  item: SanityGearItem;
  layout: "rail" | "grid";
}) {
  const image = item.image;

  return (
    <article
      className={`group overflow-hidden rounded-xl border bg-slate-800/50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 ${
        layout === "rail" ? "w-56 shrink-0 snap-start sm:w-64" : "h-full"
      } ${
        item.featured
          ? "border-brand/30 hover:border-brand/60"
          : "border-slate-700 hover:border-brand/50"
      }`}
    >
      {image?.asset.url && (
        <div className="relative aspect-square bg-slate-900">
          <Image
            src={image.asset.url}
            alt={image.alt}
            fill
            sizes={
              layout === "rail"
                ? "(min-width: 640px) 256px, 224px"
                : "min(272px, 100vw)"
            }
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-semibold text-white transition-colors group-hover:text-brand">
          {item.name}
        </h4>
      </div>
    </article>
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
  const railRef = useRef<HTMLDivElement>(null);
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
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Fades hint that the rail continues past the viewport edge. */}
      {!atStart && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-slate-900 to-transparent" />
      )}
      {!atEnd && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-slate-900 to-transparent" />
      )}

      <div
        ref={railRef}
        onScroll={updateBounds}
        tabIndex={0}
        role="group"
        aria-label={`${label} — scroll horizontally to browse`}
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {items.map((item) => (
          <GearCard key={item._id} item={item} layout="rail" />
        ))}
      </div>

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
          <div className="flex flex-wrap gap-2">
            {categoryItems.map((item) => (
              <span
                key={item._id}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  item.featured
                    ? "border-brand/20 bg-brand/10 text-brand"
                    : "border-transparent bg-slate-700 text-slate-300"
                }`}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
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
                  <GearCarousel items={items} label={title} />
                ) : (
                  // Column count is left to auto-fill: the 16rem floor against
                  // the page's 1216px content box lands on four per row at
                  // desktop widths and steps down naturally below that. The
                  // 17rem cap keeps cards near the rail's card width instead
                  // of stretching, and the min() guard stops the floor from
                  // overflowing narrow viewports.
                  <div className="grid justify-center gap-6 grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),17rem))]">
                    {items.map((item) => (
                      <GearCard key={item._id} item={item} layout="grid" />
                    ))}
                  </div>
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
    </section>
  );
}
