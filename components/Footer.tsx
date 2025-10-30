import { Github, Linkedin, Music, Instagram, Youtube, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { icon: Github, url: 'https://github.com/aidencarrera', label: 'GitHub', color: 'hover:text-purple-400' },
    { icon: Linkedin, url: 'https://linkedin.com/in/aiden-carrera', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Music, url: 'https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe', label: 'Spotify', color: 'hover:text-green-400' },
    { icon: Instagram, url: 'https://instagram.com/aiden.carrera', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Youtube, url: 'https://youtube.com/@aidencarrera', label: 'YouTube', color: 'hover:text-red-400' },
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
                className={`text-slate-400 transition-colors duration-300 ease-in-out ${link.color}`}
                aria-label={link.label}
              >
                <link.icon size={20} />
              </a>
            ))}
            {/* Mail icon goes to contact page */}
            <Link
              href="/contact"
              className="text-slate-400 hover:text-brand transition-colors duration-300 ease-in-out"
              aria-label="Contact"
            >
              <Mail size={20} />
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
