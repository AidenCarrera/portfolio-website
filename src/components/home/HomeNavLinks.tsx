import Link from "next/link";
import { motion } from "motion/react";

const BASE_LINK_CLASS =
  "w-full text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

const SECONDARY_LINK_CLASS =
  "bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-brand";

interface HomeNavLink {
  href: string;
  label: string;
  variant: string;
}

export default function HomeNavLinks() {
  const navLinks: HomeNavLink[] = [
    {
      href: "/projects",
      label: "View Projects",
      variant:
        "bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark",
    },
    {
      href: "/resume",
      label: "View Resume",
      variant:
        "bg-blue-600 hover:bg-blue-500 border border-blue-700 hover:border-blue-500",
    },
    {
      href: "/music",
      label: "Explore My Music",
      variant: SECONDARY_LINK_CLASS,
    },
    { href: "/contact", label: "Get In Touch", variant: SECONDARY_LINK_CLASS },
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 45, damping: 16, delay: 0.55 }}
    >
      {navLinks.map(({ href, label, variant }) => (
        <Link
          key={href}
          href={href}
          className={`${BASE_LINK_CLASS} ${variant}`}
        >
          <span className="text-lg">{label}</span>
          <span className="transition-transform group-hover:translate-x-1">
            {"→"}
          </span>
        </Link>
      ))}
    </motion.div>
  );
}
