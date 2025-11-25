import { MusicSnippet } from "@/types";
import { motion } from "framer-motion";

interface CassetteProps {
    snippet: MusicSnippet;
    isSelected: boolean;
    onClick: () => void;
}

export default function Cassette({ snippet, isSelected, onClick }: CassetteProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02, rotate: 1, transition: { duration: 0.1, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`relative w-full aspect-[1.6] rounded-lg overflow-hidden transition-all duration-75 group ${isSelected
                ? "ring-4 ring-brand shadow-[0_0_30px_rgba(51,230,204,0.3)] opacity-50 grayscale"
                : "hover:shadow-xl hover:shadow-brand/5"
                }`}
        >
            {/* Cassette Body - Dark Slate Plastic */}
            <div className="absolute inset-0 bg-slate-800 border-2 border-slate-700 rounded-lg p-2 flex flex-col shadow-inner">
                {/* Texture overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

                {/* Top Screw Area */}
                <div className="flex justify-between px-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                </div>

                {/* Label Area - Brand Color Accent */}
                <div className="flex-1 bg-slate-200 rounded mx-1 relative overflow-hidden shadow-sm border border-slate-300">
                    {/* Header Stripe */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-brand" />

                    {/* Title */}
                    <div className="h-full flex items-center justify-center pt-2">
                        <span className="font-mono text-slate-900 font-bold text-xs sm:text-sm leading-tight uppercase tracking-tight truncate px-2 text-center">
                            {snippet.title}
                        </span>
                    </div>

                    {/* Bottom Stripe */}
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-brand/80" />
                </div>

                {/* Tape Window Area - The Trapezoid Shape */}
                <div className="mt-1 h-16 relative mx-2">
                    {/* The Trapezoid Background (simulated with clip-path or borders, but CSS shapes are easier) */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-700 rounded-b-lg transform perspective-[100px] rotate-x-12 border-t border-slate-600" />

                    {/* Actual Window */}
                    <div className="absolute bottom-2 left-4 right-4 h-8 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-between px-2 shadow-inner">
                        {/* Left Reel */}
                        <div className="w-6 h-6 rounded-full border-2 border-slate-500 bg-white relative animate-spin-slow">
                            <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
                        </div>

                        {/* Tape Window Center */}
                        <div className="flex-1 mx-2 h-4 bg-black/60 rounded-sm border border-slate-700" />

                        {/* Right Reel */}
                        <div className="w-6 h-6 rounded-full border-2 border-slate-500 bg-white relative">
                            <div className="absolute inset-0 border-2 border-slate-800 rounded-full border-dashed opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Bottom Screw Area */}
                <div className="flex justify-between px-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-slate-600" />
                </div>
            </div>

            {/* Selection Overlay */}
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
