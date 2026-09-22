import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import Reveal from "@/components/common/Reveal";
import { getWebsiteProfile } from "@/lib/profile";
import { CONTAINER, INLINE_LINK, PROSE } from "@/lib/styles";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getWebsiteProfile();

  return {
    title: "Privacy Policy",
    description: `Privacy policy for the ${profile.name} portfolio website.`,
    alternates: {
      canonical: "/privacy",
    },
  };
}

export default async function PrivacyPolicy() {
  const profile = await getWebsiteProfile();

  return (
    <div className="pb-24 sm:pb-32">
      <PageHeader title="Privacy Policy">
        This portfolio collects only the information needed to understand site
        usage and respond to messages.
      </PageHeader>

      <Reveal className={CONTAINER}>
        <article className={`max-w-3xl border-t border-line pt-4 ${PROSE}`}>
          <h2>Information collected</h2>
          <p>
            If you use the contact form, I receive your name, email address, and
            message. Your IP address is used briefly to prevent spam and
            repeated submissions.
          </p>

          <h2>Analytics</h2>
          <p>
            Vercel Web Analytics collects anonymous, cookie-free usage data,
            such as pages visited, referrer, browser, operating system, device
            type, and performance information.
          </p>

          <h2>How information is used</h2>
          <p>
            If you contact me through the contact form, the information you
            provide is used only to respond to your message. Messages are sent
            using Resend and delivered to my email inbox.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy questions or requests,{" "}
            {profile.email ? (
              <>
                email{" "}
                <a href={`mailto:${profile.email}`} className={INLINE_LINK}>
                  {profile.email}
                </a>
              </>
            ) : (
              <>
                use the{" "}
                <Link href="/contact" className={INLINE_LINK}>
                  contact page
                </Link>
              </>
            )}
            .
          </p>

          <p className="pt-8 text-sm text-muted">Last updated July 27, 2026</p>
        </article>
      </Reveal>
    </div>
  );
}
