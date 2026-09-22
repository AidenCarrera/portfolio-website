import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import MotionProvider from "@/components/common/MotionProvider";
import SocialIcons from "@/components/common/SocialIcons";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/siteUrl";
import JsonLd from "@/components/common/JsonLd";
import { getGlobalStructuredData } from "@/lib/structuredData";
import { getWebsiteProfile, SEO_KEYWORDS } from "@/lib/profile";

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
    keywords: [profile.name, portfolioName, ...SEO_KEYWORDS],
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
  themeColor: "#060a11",
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
    // Browser extensions stamp attributes onto html and body before
    // hydration; suppressing here does not affect any child.
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <JsonLd data={getGlobalStructuredData(profile)} />
        <ScrollToTop />
        <a
          href="#main-content"
          className="sr-only rounded-full bg-brand px-5 py-2.5 font-semibold text-ink-950 shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navigation name={profile.name} socials={<SocialIcons />} />
          <main
            id="main-content"
            className="flex grow flex-col pt-nav outline-none"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer name={profile.name} />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
