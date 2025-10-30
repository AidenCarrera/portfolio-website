import { Github, Linkedin, Music, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Github, url: 'https://github.com/aidencarrera', label: 'GitHub' },
    { icon: Linkedin, url: 'https://linkedin.com/in/aiden-carrera', label: 'LinkedIn' },
    { icon: Music, url: 'https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe', label: 'Spotify' },
    { icon: Instagram, url: 'https://instagram.com/aiden.carrera', label: 'Instagram' },
    { icon: Youtube, url: 'https://youtube.com/@aidencarrera', label: 'YouTube' },
    { icon: Mail, url: 'mailto:aiden@example.com', label: 'Email' },
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
                className="text-slate-400 hover:text-amber-400 transition-colors"
                aria-label={link.label}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Aiden Carrera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
