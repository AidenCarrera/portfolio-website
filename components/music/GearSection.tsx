"use client";

import { Wrench, Music, Mic2, Speaker, Laptop } from "lucide-react";
import { GearItem } from "@/types";

interface GearSectionProps {
  gear: GearItem[];
}

const CATEGORY_ORDER = ["Software", "Hardware", "Instruments", "UAD Plugins"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Hardware: <Mic2 size={24} />,
  Instruments: <Music size={24} />,
  "UAD Plugins": <Speaker size={24} />,
  Software: <Laptop size={24} />,
};

export default function GearSection({ gear }: GearSectionProps) {
  // Group gear by category
  const groupedGear = gear.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, GearItem[]>);

  return (
    <section className="space-y-16">
      <div className="flex items-center space-x-3 mb-8">
        <Wrench className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Gear & Software</h2>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const items = groupedGear[category];
        if (!items || items.length === 0) return null;

        return (
          <div key={category} className="relative">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-2">
              <span className="text-brand">
                {CATEGORY_ICONS[category] || <Wrench size={24} />}
              </span>
              <h3 className="text-2xl font-semibold text-slate-200">
                {category}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-brand/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white group-hover:text-brand transition-colors">
                      {item.name}
                    </h4>
                  </div>

                  {item.description && (
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedGear).length === 0 && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Wrench size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Gear showcase coming soon.</p>
        </div>
      )}
    </section>
  );
}
