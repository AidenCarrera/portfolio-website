"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

// small helper to capitalize a string
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((category) => {
        const normalized = category.trim().toLowerCase();
        const isSelected = selected === normalized;

        return (
          <button
            key={normalized}
            onClick={() => onSelect(normalized)}
            aria-pressed={isSelected}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
              ${isSelected
                ? "bg-brand text-slate-900 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"}
            `}
          >
            {capitalize(category)}
          </button>
        );
      })}
    </div>
  );
}
