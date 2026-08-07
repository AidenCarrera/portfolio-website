import type { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";
import Hero from "@/components/home/Hero";
import HeroSocials from "@/components/home/HeroSocials";
import Bio from "@/components/home/Bio";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CreatorBand from "@/components/home/CreatorBand";
import ClosingCta from "@/components/home/ClosingCta";
import { splitParagraphs } from "@/lib/about";
import { getWebsiteProfile } from "@/lib/profile";
import { getProjectsInDisplayOrder } from "@/lib/projects";
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

  // Pinned projects appear first in the order specified by the Landing configuration;
  // the remaining grid populates from the curated order. If a pinned repository is
  // missing or inaccessible from GitHub, it is automatically omitted.
  const pinnedRepositories = profile.featured.repositories.map((repository) =>
    repository.toLowerCase(),
  );
  const byRepository = new Map(
    projects.map((project) => [
      project.githubRepository.toLowerCase(),
      project,
    ]),
  );
  const pinned = pinnedRepositories
    .map((repository) => byRepository.get(repository))
    .filter((project) => project !== undefined);
  const featured = [
    ...pinned,
    ...projects.filter(
      (project) =>
        !pinnedRepositories.includes(project.githubRepository.toLowerCase()),
    ),
  ].slice(0, profile.featured.count);

  return (
    <>
      <JsonLd data={getProfilePageStructuredData(profile)} />

      <Hero profile={profile} socials={<HeroSocials />} />
      <Bio
        paragraphs={splitParagraphs(profile.aboutMe)}
        name={profile.name}
        heading={profile.aboutHeading}
        portrait={profile.portrait}
      />
      <FeaturedProjects
        projects={featured}
        heading={profile.featured.heading}
        intro={profile.featured.intro}
      />
      <CreatorBand heading={profile.musicHeading} intro={profile.musicIntro} />
      <ClosingCta
        availabilityText={profile.availabilityText}
        heading={profile.contactHeading}
        email={profile.email}
      />
    </>
  );
}
