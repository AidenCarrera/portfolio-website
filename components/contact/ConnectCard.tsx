"use client";

import { Github, Linkedin, Music, Instagram, Youtube } from 'lucide-react';

const socialLinks = [
  { icon: Github, url: 'https://github.com/aidencarrera', label: 'GitHub', color: 'hover:text-purple-400' },
  { icon: Linkedin, url: 'https://linkedin.com/in/aiden-carrera', label: 'LinkedIn', color: 'hover:text-blue-400' },
  { icon: Music, url: 'https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe', label: 'Spotify', color: 'hover:text-green-400' },
  { icon: Instagram, url: 'https://instagram.com/aiden.carrera', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: Youtube, url: 'https://youtube.com/@aidencarrera', label: 'YouTube', color: 'hover:text-red-400' },
];

export default function ConnectCard() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">Connect</h2>
      <div className="space-y-3">
        {socialLinks.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-4 p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-brand/50 transition-all group ${link.color}`}
          >
            <link.icon size={24} className="text-slate-400 group-hover:text-current transition-colors" />
            <span className="text-slate-300 group-hover:text-white transition-colors font-medium">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
