import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/siteUrl";
import JsonLd from "@/components/common/JsonLd";
import { getGlobalStructuredData } from "@/lib/structuredData";
import { getWebsiteProfile } from "@/lib/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getWebsiteProfile();
  const portfolioName = `${profile.name} Portfolio`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: portfolioName,
      template: `%s | ${portfolioName}`,
    },
    description: profile.sloganText,
    alternates: {
      canonical: "/",
    },
    keywords: [
      profile.name,
      portfolioName,
      "portfolio",
      "Software Engineer Portfolio",
      "Audio Developer Portfolio",
      "Music Portfolio",
      "Software Engineer",
      "Music Producer",
      "Audio Programmer",
      "JUCE C++",
      "React Developer",
      "Web Audio API",
    ],
    authors: [{ name: profile.name }],
    creator: profile.name,
    openGraph: {
      title: portfolioName,
      description: profile.sloganText,
      url: SITE_URL,
      siteName: portfolioName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: portfolioName,
        },
      ],
    },
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "any",
        },
        {
          url: "/favicon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          type: "image/png",
          sizes: "180x180",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: portfolioName,
      description: profile.sloganText,
      images: ["/og-image.png"],
    },
  };
}

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getWebsiteProfile();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-900 text-white`}
      >
        <JsonLd data={getGlobalStructuredData(profile)} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 bg-brand text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          Skip to content
        </a>
        <Navigation name={profile.name} />
        <main
          id="main-content"
          className="flex grow flex-col pt-16 outline-none"
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer name={profile.name} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
