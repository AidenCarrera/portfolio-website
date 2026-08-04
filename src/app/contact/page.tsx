import ContactFormCard from "@/components/contact/ContactFormCard";
import ConnectCard from "@/components/contact/ConnectCard";
import { Mail } from "lucide-react";
import { getWebsiteProfile } from "@/lib/profile";
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
    <div className="min-h-screen bg-slate-900 pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Interested in working together or discussing an opportunity? Let&apos;s connect!
          </p>
        </div>

        <div className="grid items-start gap-8 md:grid-cols-2">
          <ContactFormCard email={profile.email} />
          <ConnectCard />
        </div>
      </div>
    </div>
  );
}
