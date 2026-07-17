import { motion } from "motion/react";
import type { ComponentProps } from "react";

interface CassetteVisualProps {
  title: string;
  variant: "shelf" | "deck";
  reelAnimation?: ComponentProps<typeof motion.div>["animate"];
}

export default function CassetteVisual({
  title,
  variant,
  reelAnimation,
}: CassetteVisualProps) {
  const isDeck = variant === "deck";
  const reelSize = isDeck ? "w-8 h-8" : "w-6 h-6";

  return (
    <div
      className={
        isDeck
          ? "relative w-full max-w-sm aspect-[1.6] bg-slate-800 border-2 border-slate-700 rounded-lg shadow-xl flex flex-col p-2"
          : "absolute inset-0 bg-slate-800 border-2 border-slate-700 rounded-lg p-2 flex flex-col shadow-inner"
      }
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

      <div className="flex justify-between px-1 mb-1">
        <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
        <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
      </div>

      <div className="flex-1 bg-slate-200 rounded mx-1 relative overflow-hidden shadow-sm border border-slate-300">
        <div
          className={`absolute top-0 left-0 w-full bg-brand ${isDeck ? "h-3" : "h-2"}`}
        />
        <div className="h-full flex items-center justify-center pt-2">
          <span
            className={`font-mono text-slate-900 font-bold uppercase truncate text-center ${
              isDeck
                ? "text-sm sm:text-lg px-4"
                : "text-xs sm:text-sm leading-tight tracking-tight px-2"
            }`}
          >
            {title}
          </span>
        </div>
        <div
          className={`absolute bottom-0 left-0 w-full bg-brand/80 ${isDeck ? "h-3" : "h-2"}`}
        />
      </div>

      <div className="mt-1 h-16 relative mx-2">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-700 rounded-b-lg transform perspective-dramatic rotate-x-12 border-t border-slate-600" />
        <div className="absolute bottom-2 left-4 right-4 h-8 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-between px-2 shadow-inner">
          <motion.div
            animate={reelAnimation}
            className={`${reelSize} rounded-full border-2 border-slate-500 bg-white relative ${isDeck ? "" : "animate-[spin_3s_linear_infinite]"}`}
          >
            <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
          </motion.div>
          <div className="flex-1 mx-2 h-4 bg-black/60 rounded-sm border border-slate-700" />
          <motion.div
            animate={reelAnimation}
            className={`${reelSize} rounded-full border-2 border-slate-500 bg-white relative`}
          >
            <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
          </motion.div>
        </div>
      </div>

      <div className="flex justify-between px-1 mt-1">
        <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
        <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
      </div>
    </div>
  );
}
