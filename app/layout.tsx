import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";

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
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Aiden Carrera Portfolio",
    template: "%s | Aiden Carrera",
  },
  description: "Developer & Musician Portfolio",
  openGraph: {
    title: "Aiden Carrera | Developer & Musician",
    description:
      "Portfolio showcasing software, music, and creative tech projects.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "Aiden Carrera",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aiden Carrera Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aiden Carrera | Developer & Musician",
    description:
      "Portfolio showcasing software, music, and creative tech projects.",
    images: ["/og-image.png"],
  },
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
        <Navigation />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
