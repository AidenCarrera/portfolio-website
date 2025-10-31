"use client";

import { Music } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const speed = 0.8; // base multiplier for animation speed

  const handleNavigate = (page: string) => {
    const paths: Record<string, string> = {
      projects: "/projects",
      music: "/music",
      contact: "/contact",
    };
    router.push(paths[page]);
  };

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
            transition={{ duration: 1 * speed, delay: 0.2 * speed, ease: "easeOut" }}
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
            transition={{ duration: 1 * speed, delay: 0.4 * speed, ease: "easeOut" }}
          >
            Creating innovative applications and immersive music.
          </motion.p>
        </div>

        {/* === CONTENT SECTION === */}
        <motion.div
          className="mt-24 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 * speed, delay: 0.8 * speed, ease: "easeOut" }}
        >
          {/* About Me */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-brand/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
            <div className="text-slate-300 space-y-3 leading-relaxed">
              <p>
                Prospective OSU Honors College graduate in Computer Science. I like to combine software engineering and audio programming.
              </p>
              <p>
                Experienced with C++, Java, Python, and web development. I enjoy building projects that are primarily interactive including piano apps and C++ audio plugins.
              </p>
              <p>
                Beyond coding, I actively perform as a musician in musical ensembles, create original music, and play in the OSU Jazz Band.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 * speed, delay: 1 * speed }}
          >
            <button
              onClick={() => handleNavigate("projects")}
              className="w-full bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">View Projects</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <a
              href="/Aiden_Carrera_Resume.pdf"
              download
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group border border-blue-700 hover:border-blue-500"
            >
              <span className="text-lg">Download Resume</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <button
              onClick={() => handleNavigate("music")}
              className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">Explore My Music</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => handleNavigate("contact")}
              className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">Get In Touch</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
