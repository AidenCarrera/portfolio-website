import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/common/Badge";
import EmailCopyField from "@/components/common/EmailCopyField";
import Reveal from "@/components/common/Reveal";
import { BUTTON_PRIMARY, CONTAINER } from "@/lib/styles";

interface ClosingCtaProps {
  availabilityText: string;
  email?: string;
}

export default function ClosingCta({
  availabilityText,
  email,
}: ClosingCtaProps) {
  return (
    <section
      aria-labelledby="connect-heading"
      className={`${CONTAINER} pb-20 sm:pb-28`}
    >
      <Reveal>
        <div className="rounded-[2rem] border border-line bg-ink-850 px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
          <h2 id="connect-heading" className="text-heading text-white">
            Let&rsquo;s Connect
          </h2>

          <div className="mt-8">
            <Badge oneLine>{availabilityText}</Badge>
          </div>

          {/* The email field cannot shrink below its own text, so its column
              has to be allowed to: full width on mobile and min-w-0 in the
              row, it stays inside the card instead of pushing the page
              sideways. */}
          <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            {email && (
              <div className="w-full min-w-0 sm:max-w-md">
                <EmailCopyField email={email} size="large" />
              </div>
            )}
            <Link href="/contact" className={`${BUTTON_PRIMARY} shrink-0`}>
              Get in touch
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
