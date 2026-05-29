import { Mail } from "lucide-react";
import { SiGithub, SiSpotify, SiInstagram, SiYoutube } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  const socialLinks = [
    {
      icon: SiGithub,
      url: "https://github.com/aidencarrera",
      label: "GitHub",
      color: "hover:text-purple-400",
    },
    {
      icon: FaLinkedin,
      url: "https://linkedin.com/in/aiden-carrera",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: SiSpotify,
      url: "https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe",
      label: "Spotify",
      color: "hover:text-green-400",
    },
    {
      icon: SiInstagram,
      url: "https://instagram.com/aiden.carrera",
      label: "Instagram",
      color: "hover:text-pink-400",
    },
    {
      icon: SiYoutube,
      url: "https://youtube.com/@aidencarrera",
      label: "YouTube",
      color: "hover:text-red-400",
    },
  ];

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
