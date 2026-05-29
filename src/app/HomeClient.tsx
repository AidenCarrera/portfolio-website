"use client";

import { Music } from "lucide-react";
import { motion } from "motion/react";
import AboutCard from "@/components/home/AboutCard";
import HomeNavLinks from "@/components/home/HomeNavLinks";

export default function HomeClient() {
  const speed = 0.8; // base multiplier for animation speed

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
            transition={{ duration: 1 * speed, ease: "easeOut" }}
          >
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-brand to-brand-dark mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
              <Music size={48} strokeWidth={2} />
            </div>
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl animate-pulse"></div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1 * speed,
              delay: 0.2 * speed,
              ease: "easeOut",
            }}
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
            transition={{
              duration: 1 * speed,
              delay: 0.4 * speed,
              ease: "easeOut",
            }}
          >
            Creating innovative applications and immersive music.
          </motion.p>
        </div>

        {/* === CONTENT SECTION === */}
        <motion.div
          className="mt-24 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2 * speed,
            delay: 0.8 * speed,
            ease: "easeOut",
          }}
        >
          <AboutCard />
          <HomeNavLinks speed={speed} />
        </motion.div>
      </div>
    </div>
  );
}
