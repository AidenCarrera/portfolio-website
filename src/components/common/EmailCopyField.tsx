"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

interface EmailCopyFieldProps {
  email: string;
  /** "large" is for standalone use, where the field is not one of a stack of form fields. */
  size?: "default" | "large";
}

const SIZES = {
  default: "h-12 text-[0.9375rem]",
  large: "h-14 text-base sm:text-lg",
} as const;

const COPIED_RESET_MS = 2000;

export default function EmailCopyField({
  email,
  size = "default",
}: EmailCopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // No clipboard (insecure origin, denied permission): the address is
      // still a mailto link and selectable, so there is nothing to confirm.
      return;
    }
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-full border border-line-strong bg-ink-900/70 pr-1.5 pl-5 backdrop-blur-sm transition-colors focus-within:border-brand/50 hover:border-brand/40 ${SIZES[size]}`}
    >
      <Mail className="shrink-0 text-brand" size={18} aria-hidden="true" />
      <a
        href={`mailto:${email}`}
        className="min-w-0 truncate rounded-sm text-slate-200 transition-colors hover:text-white"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copyEmail}
        aria-label={
          copied
            ? "Email address copied to clipboard"
            : "Copy email address to clipboard"
        }
        className={`ml-auto flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
          copied
            ? "bg-brand/15 text-brand"
            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        {copied ? (
          <Check size={17} aria-hidden="true" />
        ) : (
          <Copy size={17} aria-hidden="true" />
        )}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
