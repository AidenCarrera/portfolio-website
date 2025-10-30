"use client";

import { Mail, Send, Github, Linkedin, Music, Instagram, Youtube, Copy, Check } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const email = 'aiden.carrera05@gmail.com';

  const socialLinks = [
    { icon: Github, url: 'https://github.com/aidencarrera', label: 'GitHub', color: 'hover:text-purple-400' },
    { icon: Linkedin, url: 'https://linkedin.com/in/aiden-carrera', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Music, url: 'https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe', label: 'Spotify', color: 'hover:text-green-400' },
    { icon: Instagram, url: 'https://instagram.com/aiden.carrera', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Youtube, url: 'https://youtube.com/@aidencarrera', label: 'YouTube', color: 'hover:text-red-400' },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <Mail size={32} className="text-slate-900" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Let&apos;s connect and create something amazing together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Form</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm">
                    Thanks for reaching out! I&apos;ll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                    Oops! Something went wrong. Please try again or email me directly.
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Direct Contact</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-brand" size={20} />
                    <span className="text-slate-300 font-mono text-sm">{email}</span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2 rounded-lg hover:bg-slate-600 transition-colors"
                    title="Copy email"
                  >
                    {copied ? (
                      <Check className="text-green-400" size={20} />
                    ) : (
                      <Copy className="text-slate-400" size={20} />
                    )}
                  </button>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all text-center"
                >
                  Send Email Directly
                </a>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Connect</h2>

              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-4 p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-brand/50 transition-all group ${link.color}`}
                  >
                    <link.icon size={24} className="text-slate-400 group-hover:text-current transition-colors" />
                    <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
