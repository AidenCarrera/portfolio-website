import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CONTAINER } from "@/lib/styles";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center">
      <div className={`${CONTAINER} py-24 text-center sm:py-32`}>
        <h1 className="text-title text-white">
          <span className="text-brand">404</span> Page not found
        </h1>

        {/* A scope with no input: the trace lies flat while the beam keeps
            sweeping across it. */}
        <div
          aria-hidden="true"
          className="relative mx-auto mt-12 h-16 max-w-xl overflow-hidden"
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-brand/40 to-transparent" />
          <div className="animate-playhead absolute inset-0">
            <div className="absolute top-1/2 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_16px_4px_rgb(0_255_204/0.6)]" />
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-slate-400">
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={BUTTON_PRIMARY}>
            Return Home
          </Link>
          <Link href="/projects" className={BUTTON_SECONDARY}>
            View Projects
            <ArrowRight
              size={17}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
