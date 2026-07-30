"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Wrench, Music, Mic2, Speaker, Laptop } from "lucide-react";
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

function GearCard({ item }: { item: SanityGearItem }) {
  const image = item.image;

  return (
    <article
      className={`group h-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/5 ${
        item.featured ? "sm:col-span-2" : ""
      }`}
    >
      {image?.asset.url && (
        <div className="relative aspect-video bg-slate-900">
          <Image
            src={image.asset.url}
            alt={image.alt}
            fill
            sizes={
              item.featured
                ? "(min-width: 640px) 66vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h4 className="font-semibold text-white transition-colors group-hover:text-brand">
          {item.name}
        </h4>
      </div>
    </article>
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

                {PLUGIN_TYPES.has(type) ? (
                  <PluginList items={items} />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <GearCard key={item._id} item={item} />
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
