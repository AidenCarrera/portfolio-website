"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

// small helper to capitalize a string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="relative w-full -mx-4 px-4 mb-10 overflow-hidden md:mx-0 md:px-0">
      {/* Left/Right Edge Fades for Mobile Horizontal Scroll Indication */}
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-linear-to-r from-slate-900 to-transparent pointer-events-none z-10 md:hidden" />
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-linear-to-l from-slate-900 to-transparent pointer-events-none z-10 md:hidden" />

      <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-none md:flex-wrap md:justify-center px-4 md:px-0 snap-x snap-mandatory">
        {categories.map((category) => {
          const normalized = category.trim().toLowerCase();
          const isSelected = selected === normalized;

          return (
            <button
              key={normalized}
              onClick={() => onSelect(normalized)}
              aria-pressed={isSelected}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand
                ${
                  isSelected
                    ? "bg-brand text-slate-900 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }
              `}
            >
              {capitalize(category)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
