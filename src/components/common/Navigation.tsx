"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "projects", label: "Projects", path: "/projects" },
    { id: "music", label: "Music", path: "/music" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const hoverLift = {
    scale: 1.05,
    y: -2,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  } as const; // lift and slightly scale on hover

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <MotionLink
            href="/"
            whileHover={hoverLift}
            className="text-xl font-bold text-white hover:text-brand transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg px-2 py-1"
          >
            Aiden Carrera
          </MotionLink>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <MotionLink
                key={item.id}
                href={item.path}
                whileHover={hoverLift}
                className={`text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-2 py-1 ${
                  isActive(item.path)
                    ? "text-brand"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </MotionLink>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <MotionLink
                key={item.id}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                whileHover={hoverLift}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isActive(item.path)
                    ? "text-brand bg-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {item.label}
              </MotionLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
