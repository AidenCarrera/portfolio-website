import Link from "next/link";
import { motion } from "motion/react";

const BASE_LINK_CLASS =
  "w-full text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

const SECONDARY_LINK_CLASS =
  "bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-brand";

interface HomeNavLinksProps {
  resumeUrl?: string;
}

interface HomeNavLink {
  href: string;
  label: string;
  variant: string;
  download?: boolean;
  ariaLabel?: string;
}

export default function HomeNavLinks({ resumeUrl }: HomeNavLinksProps) {
  const navLinks: HomeNavLink[] = [
    {
      href: "/projects",
      label: "View Projects",
      variant:
        "bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark",
    },
    ...(resumeUrl
      ? [
          {
            href: resumeUrl,
            label: "Download Resume",
            variant:
              "bg-blue-600 hover:bg-blue-500 border border-blue-700 hover:border-blue-500",
            download: true,
            ariaLabel: "Download Resume (PDF)",
          },
        ]
      : []),
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
      {navLinks.map(({ href, label, variant, download, ariaLabel }) => {
        const className = `${BASE_LINK_CLASS} ${variant}`;
        const content = (
          <>
            <span className="text-lg">{label}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </>
        );

        return download ? (
          <a
            key={href}
            href={href}
            download
            aria-label={ariaLabel}
            className={className}
          >
            {content}
          </a>
        ) : (
          <Link key={href} href={href} className={className}>
            {content}
          </Link>
        );
      })}
    </motion.div>
  );
}
