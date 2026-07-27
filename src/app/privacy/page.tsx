import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the Aiden Carrera portfolio website.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-1 bg-slate-900 px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
      <article className="mx-auto w-full max-w-3xl">
        <p className="mb-3 font-mono text-sm text-brand">
          Last updated July 27, 2026
        </p>
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mb-10 text-lg leading-8 text-slate-400">
          This portfolio collects only the information needed to understand site
          usage and respond to messages.
        </p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              Information collected
            </h2>
            <p className="leading-7">
              If you use the contact form, I receive your name, email address,
              and message. Your IP address is used briefly to prevent spam and
              repeated submissions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">Analytics</h2>
            <p className="leading-7">
              Vercel Web Analytics collects anonymous, cookie-free usage data,
              such as pages visited, referrer, browser, operating system, device
              type, and performance information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              How information is used
            </h2>
            <p className="leading-7">
              If you contact me through the contact form, the information you
              provide is used only to respond to your message. Messages are sent
              using Resend and delivered to my email inbox.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">Contact</h2>
            <p className="leading-7">
              For privacy questions or requests, email{" "}
              <a
                href="mailto:aiden.carrera05@gmail.com"
                className="rounded text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                aiden.carrera05@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
