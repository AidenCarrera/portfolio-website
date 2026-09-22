"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { CONTACT_LIMITS } from "@/lib/contact";
import { BUTTON_PRIMARY } from "@/lib/styles";

interface FormState {
  status: "idle" | "success" | "error";
}

const labelClassName = "eyebrow block text-slate-400";
// Inputs are always :focus-visible when focused, so they get their own ring:
// a brand border plus a soft halo, in place of the site-wide outline.
const fieldBaseClassName =
  "mt-2.5 w-full rounded-xl border border-line-strong bg-ink-900/70 text-white placeholder-slate-600 transition-[border-color,background-color,box-shadow] duration-200 hover:border-slate-500/40 focus:border-brand/70 focus:bg-ink-900 focus:shadow-[0_0_0_4px_rgb(0_255_204/0.12)] focus:outline-none";
const singleLineFieldClassName = `${fieldBaseClassName} h-12 px-4`;
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

export default function ContactFormCard() {
  const [state, formAction, isPending] = useActionState(contactAction, {
    status: "idle",
  } as FormState);
  const formRef = useRef<HTMLFormElement>(null);
  const [messageLength, setMessageLength] = useState(0);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  const nearLimit = messageLength > CONTACT_LIMITS.message * 0.9;

  return (
    <div className="relative panel rounded-[1.5rem] p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
        Contact Form
      </h2>
      <p className="mt-2 text-slate-400">Messages land straight in my inbox.</p>

      <form
        ref={formRef}
        action={formAction}
        // A reset clears the fields but fires no input event, so the counter
        // is zeroed here rather than left showing the sent message's length.
        onReset={() => setMessageLength(0)}
        className="mt-8 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClassName}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              maxLength={CONTACT_LIMITS.name}
              className={singleLineFieldClassName}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              maxLength={CONTACT_LIMITS.email}
              className={singleLineFieldClassName}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="message" className={labelClassName}>
              Message
            </label>
            <span
              id="message-count"
              className={`font-mono text-[0.6875rem] tabular-nums transition-colors ${
                nearLimit ? "text-amber-300" : "text-muted"
              }`}
            >
              {messageLength} / {CONTACT_LIMITS.message}
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            required
            maxLength={CONTACT_LIMITS.message}
            rows={6}
            aria-describedby="message-count"
            onChange={(event) =>
              setMessageLength(event.currentTarget.value.length)
            }
            className={`${multilineFieldClassName} resize-none`}
            placeholder="Tell me about your project or idea..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`${BUTTON_PRIMARY} w-full`}
        >
          {isPending ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send
                size={17}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>

        {/* One live region for both outcomes, so either is announced. */}
        <div role="status">
          {state.status === "success" && (
            <p className="flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] p-4 text-sm text-emerald-300">
              <CheckCircle2
                size={18}
                aria-hidden="true"
                className="mt-px shrink-0"
              />
              Thanks for reaching out! I&apos;ll get back to you soon.
            </p>
          )}

          {state.status === "error" && (
            <p className="flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-400/[0.08] p-4 text-sm text-rose-300">
              <AlertCircle
                size={18}
                aria-hidden="true"
                className="mt-px shrink-0"
              />
              Oops! Something went wrong. Please try again or email me directly.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
