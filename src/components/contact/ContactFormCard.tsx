"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { Check, Copy, Mail, Send } from "lucide-react";
import { CONTACT_LIMITS } from "@/lib/contact";

interface ContactFormCardProps {
  email?: string;
}

interface FormState {
  status: "idle" | "success" | "error";
}

const fieldBaseClassName =
  "w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand";
const singleLineFieldClassName = `${fieldBaseClassName} h-[50px] px-4`;
const multilineFieldClassName = `${fieldBaseClassName} px-4 py-3`;

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

export default function ContactFormCard({ email }: ContactFormCardProps) {
  const [state, formAction, isPending] = useActionState(contactAction, {
    status: "idle",
  } as FormState);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const copyEmail = () => {
    if (!email) return;

    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Contact Form</h2>

        {email && (
          <div className="mb-6">
            <h3 className="mb-2 block text-sm font-medium text-slate-300">
              Direct Contact
            </h3>
            <div
              className={`${singleLineFieldClassName} flex items-center justify-between`}
            >
              <div className="flex min-w-0 items-center space-x-3">
                <Mail className="shrink-0 text-brand" size={20} />
                <span className="truncate text-slate-300">{email}</span>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={
                  copied
                    ? "Email address copied to clipboard"
                    : "Copy email address to clipboard"
                }
                className="ml-3 rounded-lg p-2 transition-colors hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {copied ? (
                  <Check className="text-green-400" size={20} />
                ) : (
                  <Copy className="text-slate-400" size={20} />
                )}
              </button>
            </div>
          </div>
        )}

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
              maxLength={CONTACT_LIMITS.name}
              className={singleLineFieldClassName}
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
              maxLength={CONTACT_LIMITS.email}
              className={singleLineFieldClassName}
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
              maxLength={CONTACT_LIMITS.message}
              rows={5}
              className={`${multilineFieldClassName} resize-none`}
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
