"use client";

import { motion } from "motion/react";
import Image from "next/image";
import AboutCard from "@/components/home/AboutCard";
import HomeNavLinks from "@/components/home/HomeNavLinks";

export default function HomeClient() {
  const springTransition = {
    type: "spring",
    stiffness: 45,
    damping: 16,
  } as const;

  return (
    <div className="flex-1 flex flex-col justify-center bg-linear-to-br bg-animated-dark pt-20 sm:pt-24 pb-6 sm:pb-8 min-h-[calc(100vh-4rem-3.5rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="text-center space-y-6">
          <motion.div
            className="relative inline-block -mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0 }}
          >
            <div className="w-32 h-32 mx-auto mb-3 rounded-full shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-brand/20">
              <Image
                src="/developer-logo.svg"
                alt="Aiden Carrera - Audio Developer Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl animate-pulse -z-10"></div>
          </motion.div>

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

          <motion.p
            className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
          >
            I build creative software and make original music.
          </motion.p>
        </div>

        <motion.div
          className="mt-16 sm:mt-20 md:mt-24 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full items-stretch"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.45 }}
        >
          <AboutCard />
          <HomeNavLinks />
        </motion.div>
      </div>
    </div>
  );
}
