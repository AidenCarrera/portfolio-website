import { Wrench, Music, Mic2, Speaker, Laptop } from "lucide-react";
import type { GearItemType, SanityGearItem } from "@/sanity/types";

interface GearSectionProps {
  gear: SanityGearItem[];
}

const TYPE_SECTIONS: Array<{
  type: GearItemType;
  title: string;
  icon: React.ReactNode;
}> = [
  {
    type: "instrument",
    title: "Instruments",
    icon: <Music size={24} />,
  },
  {
    type: "hardware",
    title: "Hardware",
    icon: <Mic2 size={24} />,
  },
  {
    type: "software",
    title: "Software",
    icon: <Laptop size={24} />,
  },
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

const PLUGIN_TYPES = new Set<GearItemType>([
  "instrumentPlugin",
  "mixingPlugin",
]);

function GearCard({
  item,
  nested = false,
}: {
  item: SanityGearItem;
  nested?: boolean;
}) {
  const Heading = nested ? "h5" : "h4";

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-brand/50 hover:bg-slate-800/50 transition-all group">
      <Heading className="text-lg font-semibold text-white group-hover:text-brand transition-colors">
        {item.name}
      </Heading>
    </div>
  );
}

function GearGrid({
  items,
  nested = false,
}: {
  items: SanityGearItem[];
  nested?: boolean;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <GearCard key={item._id} item={item} nested={nested} />
      ))}
    </div>
  );
}

function groupByCategory(items: SanityGearItem[]) {
  const groups = new Map<string, SanityGearItem[]>();

  for (const item of items) {
    const category = item.category?.trim() || "Other";
    const categoryItems = groups.get(category) ?? [];
    categoryItems.push(item);
    groups.set(category, categoryItems);
  }

  return Array.from(groups.entries());
}

export default function GearSection({ gear }: GearSectionProps) {
  const itemsByType = new Map<GearItemType, SanityGearItem[]>();

  for (const item of gear) {
    const typeItems = itemsByType.get(item.type) ?? [];
    typeItems.push(item);
    itemsByType.set(item.type, typeItems);
  }

  return (
    <section className="space-y-16">
      <div className="flex items-center space-x-3 mb-8">
        <Wrench className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Gear & Software</h2>
      </div>

      {TYPE_SECTIONS.map(({ type, title, icon }) => {
        const items = itemsByType.get(type);
        if (!items || items.length === 0) return null;
        const shouldGroupByCategory = PLUGIN_TYPES.has(type);

        return (
          <div key={type} className="relative">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-2">
              <span className="text-brand">{icon}</span>
              <h3 className="text-2xl font-semibold text-slate-200">{title}</h3>
            </div>

            {shouldGroupByCategory ? (
              <div className="space-y-8">
                {groupByCategory(items).map(([category, categoryItems]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">
                      {category}
                    </h4>
                    <GearGrid items={categoryItems} nested />
                  </div>
                ))}
              </div>
            ) : (
              <GearGrid items={items} />
            )}
          </div>
        );
      })}

      {gear.length === 0 && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Wrench size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Gear showcase coming soon.</p>
        </div>
      )}
    </section>
  );
}
