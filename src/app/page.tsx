import type { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";
import SocialIcons from "@/components/common/SocialIcons";
import Hero from "@/components/home/Hero";
import Bio from "@/components/home/Bio";
import Skills from "@/components/home/Skills";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CreatorBand from "@/components/home/CreatorBand";
import ClosingCta from "@/components/home/ClosingCta";
import { splitParagraphs } from "@/lib/about";
import { getWebsiteProfile } from "@/lib/profile";
import {
  getProjectsInDisplayOrder,
  selectFeaturedProjects,
} from "@/lib/projects";
import { getProfilePageStructuredData } from "@/lib/structuredData";

// Kept in step with the projects page's revalidate window.
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [profile, projects] = await Promise.all([
    getWebsiteProfile(),
    getProjectsInDisplayOrder(),
  ]);
  const featured = selectFeaturedProjects(profile, projects);

  return (
    <>
      <JsonLd data={getProfilePageStructuredData(profile)} />

      <Hero profile={profile} socials={<SocialIcons />} />
      <Bio
        paragraphs={splitParagraphs(profile.aboutMe)}
        name={profile.name}
        portrait={profile.portrait}
      />
      <FeaturedProjects projects={featured} intro={profile.featured.intro} />
      <Skills
        intro={profile.skills.intro}
        categories={profile.skills.categories}
      />
      <CreatorBand intro={profile.musicIntro} />
      <ClosingCta
        availabilityText={profile.availabilityText}
        email={profile.email}
      />
    </>
  );
}
