"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

export default function ContactFormCard() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Call the secure API route that uses the service role key
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data.error || "Unknown error");
        setSubmitStatus("error");
        return;
      }

      console.log("Form submitted successfully:", data);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Network or unexpected error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

          {submitStatus === "success" && (
            <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm">
              Thanks for reaching out! I&apos;ll get back to you soon.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              Oops! Something went wrong. Please try again or email me directly.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
