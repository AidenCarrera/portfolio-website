"use client";

import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

const email = "aiden.carrera05@gmail.com";

export default function DirectContactCard() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Direct Contact</h2>

      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
        <div className="flex items-center space-x-3">
          <Mail className="text-brand" size={20} />
          <span className="text-slate-300 font-mono text-sm">{email}</span>
        </div>
        <button
          onClick={copyEmail}
          className="p-2 rounded-lg hover:bg-slate-600 transition-colors"
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
        className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg text-center"
      >
        Send Email Directly
      </a>
    </div>
  );
}
