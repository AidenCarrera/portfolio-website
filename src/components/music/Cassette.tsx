import type { MusicSnippet } from "@/types";
import { motion } from "motion/react";
import CassetteVisual from "./CassetteVisual";

interface CassetteProps {
  snippet: MusicSnippet;
  isSelected: boolean;
  onClick: () => void;
}

const SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;

export default function Cassette({
  snippet,
  isSelected,
  onClick,
}: CassetteProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6, rotate: -1.5, transition: SPRING }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      aria-label={`Load cassette tape: ${snippet.title}`}
      aria-pressed={isSelected}
      className="group relative block aspect-[1.58] w-full rounded-[5%/8%]"
    >
      {/* The loaded tape is in the deck, so its slot on the shelf reads as
          taken rather than available. */}
      <div
        className={`absolute inset-0 transition-[opacity,filter] duration-300 ${
          isSelected ? "opacity-35 saturate-0" : ""
        }`}
      >
        <CassetteVisual title={snippet.title} variant="shelf" />
      </div>

      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-brand/40 bg-ink-950/90 px-3 py-1.5 text-brand shadow-[0_0_24px_-4px_rgb(0_255_204/0.6)] backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
            Loaded
          </span>
        </span>
      )}
    </motion.button>
  );
}
