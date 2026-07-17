import HomeClient from "./HomeClient";
import type { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";
import { profilePageStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={profilePageStructuredData} />
      <HomeClient />
    </>
  );
}
