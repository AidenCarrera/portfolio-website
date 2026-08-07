"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

interface EmailCopyFieldProps {
  email: string;
  /** "large" is for standalone use, where the field is not one of a stack of form fields. */
  size?: "default" | "large";
}

const SIZES = {
  default: "h-[50px] text-base",
  large: "h-14 text-lg",
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

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <div
      className={`flex w-full items-center justify-between rounded-lg border border-slate-600 bg-slate-700 px-4 text-white ${SIZES[size]}`}
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
  );
}
