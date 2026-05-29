import Link from "next/link";
import { motion } from "motion/react";

interface HomeNavLinksProps {
  delay?: number;
}

export default function HomeNavLinks({ delay = 0.55 }: HomeNavLinksProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 45, damping: 16, delay }}
    >
      <Link
        href="/projects"
        className="w-full bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="text-lg">View Projects</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </Link>

      <a
        href="/Aiden_Carrera_Resume.pdf"
        download
        aria-label="Download Resume (PDF)"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group border border-blue-700 hover:border-blue-500 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="text-lg">Download Resume</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </a>

      <Link
        href="/music"
        className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="text-lg">Explore My Music</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </Link>

      <Link
        href="/contact"
        className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="text-lg">Get In Touch</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </Link>
    </motion.div>
  );
}
