import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aiden Carrera Portfolio",
  description: "Developer & Musician Portfolio",
  openGraph: {
    title: "Aiden Carrera | Developer & Musician",
    description: "Portfolio showcasing software, music, and creative tech projects.",
    url: "",
    siteName: "Aiden Carrera",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Aiden Carrera Portfolio" },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
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
        {/* Navigation always visible */}
        <Navigation />

        {/* Main content */}
        <main className="grow">{children}</main>

        {/* Footer always visible */}
        <Footer />
      </body>
    </html>
  );
}
