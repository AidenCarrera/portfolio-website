import HomeClient from "./HomeClient";
import type { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";
import { getWebsiteProfile } from "@/lib/profile";
import { getProfilePageStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const profile = await getWebsiteProfile();

  return (
    <>
      <JsonLd data={getProfilePageStructuredData(profile)} />
      <HomeClient profile={profile} />
    </>
  );
}
