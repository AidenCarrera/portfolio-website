import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/common/Badge";
import EmailCopyField from "@/components/common/EmailCopyField";
import Reveal from "./Reveal";

interface ClosingCtaProps {
  availabilityText: string;
  heading: string;
  email?: string;
}

export default function ClosingCta({
  availabilityText,
  heading,
  email,
}: ClosingCtaProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-700/80 bg-slate-800/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {heading}
            </h2>

            <div className="mt-4">
              <Badge>{availabilityText}</Badge>
            </div>

            {email && (
              <div className="mt-5 max-w-md">
                <EmailCopyField email={email} size="large" />
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-dark to-brand-darker px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand/10 transition-transform hover:-translate-y-0.5 hover:from-brand hover:to-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto"
          >
            Get in touch
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
