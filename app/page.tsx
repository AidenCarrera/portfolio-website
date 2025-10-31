"use client";

import { Github, Linkedin, Music, Instagram, Youtube, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const speed = 0.8; // base multiplier, tweak this to speed up or slow down all fades

  const socialLinks = [
    { icon: Github, url: "https://github.com/aidencarrera", label: "GitHub", color: "hover:text-purple-400" },
    { icon: Linkedin, url: "https://linkedin.com/in/aiden-carrera", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: Music, url: "https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe", label: "Spotify", color: "hover:text-green-400" },
    { icon: Instagram, url: "https://instagram.com/aiden.carrera", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Youtube, url: "https://youtube.com/@aidencarrera", label: "YouTube", color: "hover:text-red-400" },
  ];

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
            Creating immersive music and innovative applications.
          </motion.p>

          {/* Social Icons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 * speed, delay: 0.6 * speed }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-brand transition-all hover:scale-110"
                aria-label={link.label}
              >
                <link.icon
                  size={24}
                  className={`text-slate-300 transition-colors duration-300 ease-in-out ${link.color}`}
                />
              </a>
            ))}
            <Link
              href="/contact"
              className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-brand transition-all hover:scale-110"
              aria-label="Contact"
            >
              <Mail size={24} className="text-slate-300 hover:text-brand transition-colors duration-300 ease-in-out" />
            </Link>
          </motion.div>
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
                Computer Science student at Oklahoma State University, passionate about blending music, technology, and audio production.
              </p>
              <p>
                Currently, I&apos;m exploring AI and software tools for music education, music creation, and other innovative ways to merge code with sound.
              </p>
              <p>
                I&apos;m also a musician currently working on new songs. I&apos;ve collaborated with losshack handling the recording, producing, and mastering tracks myself.
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
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Resume Download Button */}
            <a
              href="/Aiden_Carrera_Resume.pdf"
              download
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group border border-blue-700 hover:border-blue-500"
            >
              <span className="text-lg">Download Resume</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button
              onClick={() => handleNavigate("music")}
              className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">Explore My Music</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigate("contact")}
              className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">Get In Touch</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
