import ContactFormCard from "@/components/contact/ContactFormCard";
import ConnectCard from "@/components/contact/ConnectCard";
import EmailCopyField from "@/components/common/EmailCopyField";
import PageHeader from "@/components/common/PageHeader";
import Reveal from "@/components/common/Reveal";
import { getWebsiteProfile } from "@/lib/profile";
import { CONTAINER } from "@/lib/styles";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getWebsiteProfile();

  return {
    title: "Contact",
    description: `Get in touch with ${profile.name} for software development and music production inquiries.`,
    alternates: {
      canonical: "/contact",
    },
  };
}

export default async function Contact() {
  const profile = await getWebsiteProfile();

  return (
    <div className="pb-24 sm:pb-32">
      <PageHeader title="Get In Touch">
        Interested in working together or discussing an opportunity? Let&apos;s
        connect!
      </PageHeader>

      <div
        className={`${CONTAINER} grid items-start gap-12 lg:grid-cols-12 lg:gap-16`}
      >
        {/* min-w-0: the email field cannot shrink below its own text, so
            without it the column grows past a phone's width. */}
        <Reveal className="min-w-0 space-y-12 lg:col-span-5">
          {profile.email && (
            <section aria-labelledby="direct-heading">
              <h2 id="direct-heading" className="eyebrow text-muted">
                Direct Contact
              </h2>
              <div className="mt-4">
                <EmailCopyField email={profile.email} size="large" />
              </div>
            </section>
          )}
          <ConnectCard />
        </Reveal>

        <Reveal delay={0.08} className="min-w-0 lg:col-span-7">
          <ContactFormCard />
        </Reveal>
      </div>
    </div>
  );
}
