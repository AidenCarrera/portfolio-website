"use client";

import { motion } from "motion/react";
import AboutCard from "@/components/home/AboutCard";
import HomeNavLinks from "@/components/home/HomeNavLinks";

export default function HomeClient() {
  // Slower, elegant spring curve for premium feel
  const springTransition = {
    type: "spring",
    stiffness: 45,
    damping: 16,
  } as const;

  return (
    <div className="min-h-screen bg-linear-to-br bg-animated-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* === HERO SECTION === */}
        <div className="text-center space-y-8">
          {/* Icon */}
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0 }}
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-brand/20">
              <img
                src="/developer-logo.svg"
                alt="Aiden Carrera - Audio Developer Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl animate-pulse -z-10"></div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.15 }}
          >
            Musician. Producer.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand to-brand-dark">
              Developer.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
          >
            Creating innovative applications and immersive music.
          </motion.p>
        </div>

        {/* === CONTENT SECTION === */}
        <motion.div
          className="mt-24 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.45 }}
        >
          <AboutCard />
          <HomeNavLinks delay={0.55} />
        </motion.div>
      </div>
    </div>
  );
}
