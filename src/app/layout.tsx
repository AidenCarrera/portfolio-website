import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // helps avoid FOIT (flash of invisible text)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Next.js 16 metadata structure with metadataBase
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : "http://localhost:3000"),
  ),
  title: {
    default: "Aiden Carrera Portfolio",
    template: "%s | Aiden Carrera Portfolio",
  },
  description:
    "Software engineering, audio programming, and music production portfolio of Aiden Carrera.",
  keywords: [
    "Aiden Carrera",
    "Aiden Carrera Portfolio",
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
  authors: [{ name: "Aiden Carrera" }],
  creator: "Aiden Carrera",
  verification: {
    google: "ivXP4BMnsO5q10Rcb1-RDmAgpQmwBQR-d4ckfFDQB9c",
  },
  openGraph: {
    title: "Aiden Carrera Portfolio",
    description:
      "Software engineering, audio programming, and music production portfolio of Aiden Carrera.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "Aiden Carrera Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aiden Carrera Portfolio",
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
        url: "/developer-favicon.svg",
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
    title: "Aiden Carrera | Developer & Musician Portfolio",
    description:
      "Software engineering, audio programming, and music production portfolio of Aiden Carrera.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-900 text-white`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 bg-brand text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main-content" className="grow outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
