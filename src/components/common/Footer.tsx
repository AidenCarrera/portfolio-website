import { Mail } from "lucide-react";
import Link from "next/link";
import { socialLinks } from "@/lib/socialLinks";

export default function Footer() {
  return (
    <footer className="bg-slate-900/90 backdrop-blur-sm border-t border-slate-800 py-3 sm:py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-sm">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Aiden Carrera. All rights reserved.
          </p>
          <span className="text-slate-700" aria-hidden="true">
            /
          </span>
          <Link
            href="/privacy"
            className="text-slate-500 transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Privacy
          </Link>
        </div>
        <div className="flex items-center space-x-5">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-slate-400 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1 ${link.color}`}
              aria-label={link.label}
            >
              <link.icon size={20} />
            </a>
          ))}
          <Link
            href="/contact"
            className="text-slate-400 hover:text-brand transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1"
            aria-label="Contact"
          >
            <Mail size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
