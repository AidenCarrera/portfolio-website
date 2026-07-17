"use client";

import { useActionState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface FormState {
  status: "idle" | "success" | "error";
}

async function contactAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: (formData.get("name") as string)?.trim(),
        email: (formData.get("email") as string)?.trim(),
        message: (formData.get("message") as string)?.trim(),
      }),
    });

    if (!res.ok) return { status: "error" };
    return { status: "success" };
  } catch (err) {
    console.error(err);
    return { status: "error" };
  }
}

export default function ContactFormCard() {
  const [state, formAction, isPending] = useActionState(contactAction, {
    status: "idle",
  } as FormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Contact Form</h2>

        <form ref={formRef} action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              maxLength={254}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={1000}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
              placeholder="Tell me about your project or idea..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-linear-to-r from-brand-dark to-brand-darker hover:from-brand hover:to-brand-dark text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {isPending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send size={20} />
                <span>Send Message</span>
              </>
            )}
          </button>

          {state.status === "success" && (
            <div
              role="status"
              className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm"
            >
              Thanks for reaching out! I&apos;ll get back to you soon.
            </div>
          )}

          {state.status === "error" && (
            <div
              role="status"
              className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm"
            >
              Oops! Something went wrong. Please try again or email me directly.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
