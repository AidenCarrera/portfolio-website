import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center bg-slate-900 px-4 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-brand to-brand-dark">
          <FileQuestion size={32} className="text-white" aria-hidden="true" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          <span className="text-brand">404</span> Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-slate-400">
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-brand px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Return Home
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-white transition-colors hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
