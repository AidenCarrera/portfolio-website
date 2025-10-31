"use client";

import { Wrench } from "lucide-react";
import { GearItem } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface GearSectionProps {
  gear: GearItem[];
}

export default function GearSection({ gear }: GearSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = ["all", ...new Set(gear.map((g) => g.category))];
  const filteredGear =
    selectedCategory === "all" ? gear : gear.filter((g) => g.category === selectedCategory);

  return (
    <section>
      <div className="flex items-center space-x-3 mb-8">
        <Wrench className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Gear & Software</h2>
      </div>

      {gear.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-amber-500 text-slate-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {filteredGear.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGear.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all group"
            >
              {item.image_url ? (
                <div className="w-full h-40 relative mb-4">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <Wrench size={48} className="text-slate-500" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand transition-colors">
                {item.name}
              </h3>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300 mb-2">
                {item.category}
              </span>
              {item.description && (
                <p className="text-slate-400 text-sm">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Wrench size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Gear showcase coming soon.</p>
        </div>
      )}
    </section>
  );
}
