import { Mail } from "lucide-react";
import Link from "next/link";
import { socialLinks } from "@/lib/socialLinks";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1 ${link.color}`}
                aria-label={link.label}
              >
                <link.icon size={24} />
              </a>
            ))}
            {/* Mail icon goes to contact page */}
            <Link
              href="/contact"
              className="text-slate-400 hover:text-brand transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1"
              aria-label="Contact"
            >
              <Mail size={24} />
            </Link>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Aiden Carrera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
