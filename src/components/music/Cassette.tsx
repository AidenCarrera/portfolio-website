import type { MusicSnippet } from "@/types";
import { motion } from "motion/react";
import CassetteVisual from "./CassetteVisual";

interface CassetteProps {
  snippet: MusicSnippet;
  isSelected: boolean;
  onClick: () => void;
}

export default function Cassette({
  snippet,
  isSelected,
  onClick,
}: CassetteProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        rotate: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label={`Load cassette tape: ${snippet.title}`}
      aria-pressed={isSelected}
      className={`relative w-full aspect-[1.6] rounded-lg overflow-hidden transition-all duration-75 group focus:outline-none focus-visible:ring-4 focus-visible:ring-brand ${
        isSelected
          ? "ring-4 ring-brand shadow-[0_0_30px_rgba(51,230,204,0.3)] opacity-50 grayscale"
          : "hover:shadow-xl hover:shadow-brand/5"
      }`}
    >
      <CassetteVisual title={snippet.title} variant="shelf" />

      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <span className="bg-brand text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/20">
            Loaded
          </span>
        </div>
      )}
    </motion.button>
  );
}
