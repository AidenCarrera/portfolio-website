"use client";

import ContactFormCard from '@/components/contact/ContactFormCard';
import DirectContactCard from '@/components/contact/DirectContactCard';
import ConnectCard from '@/components/contact/ConnectCard';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Let&apos;s connect and create something amazing together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactFormCard />
          <div className="space-y-8">
            <DirectContactCard />
            <ConnectCard />
          </div>
        </div>
      </div>
    </div>
  );
}
