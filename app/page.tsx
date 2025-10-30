"use client";

import { Github, Linkedin, Music, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const socialLinks = [
    { icon: Github, url: 'https://github.com/aidencarrera', label: 'GitHub' },
    { icon: Linkedin, url: 'https://linkedin.com/in/aidencarrera', label: 'LinkedIn' },
    { icon: Music, url: 'https://open.spotify.com/artist/aidencarrera', label: 'Spotify' },
    { icon: Instagram, url: 'https://instagram.com/aidencarrera', label: 'Instagram' },
    { icon: Youtube, url: 'https://youtube.com/@aidencarrera', label: 'YouTube' },
    { icon: Mail, url: 'mailto:aiden@example.com', label: 'Email' },
  ];

  const handleNavigate = (page: string) => {
    const paths: Record<string, string> = {
      projects: '/projects',
      music: '/music',
      contact: '/contact',
    };
    router.push(paths[page]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 bg-animated-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-brand to-brand-dark mx-auto mb-6 flex items-center justify-center text-white">
              <Music size={48} strokeWidth={2} />
            </div>
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl animate-pulse"></div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            Musician. Producer.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand to-brand-dark">
              Developer.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto">
            Creating immersive music and innovative applications.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-brand transition-all hover:scale-110"
                aria-label={link.label}
              >
                <link.icon size={24} className="text-slate-300 hover:text-brand transition-colors" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-brand/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
            <div className="text-slate-300 space-y-3 leading-relaxed">
              <p>
                Computer Science student at Oklahoma State University, passionate about blending music, technology, and audio production.
              </p>
              <p>
                Currently, I&apos;m exploring AI and software tools for music education, music creation, and other innovative ways to merge code with sound.
              </p>
              <p>
                I&apos;m also a musician currently working on new songs. I&apos;ve collaborated with losshack handling the recording, producing, and mastering tracks myself.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleNavigate('music')}
              className="w-full bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">View Projects</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigate('music')}
              className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">Explore My Music</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigate('contact')}
              className="w-full bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 hover:border-brand transition-all hover:scale-105 flex items-center justify-between group"
            >
              <span className="text-lg">Get In Touch</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
