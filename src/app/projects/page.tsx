import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import PageHeader from "@/components/common/PageHeader";
import { getGitHubProfileUrl } from "@/lib/github";
import { getRoutableProjects } from "@/lib/projects";
import { BUTTON_SECONDARY, CONTAINER } from "@/lib/styles";
import ProjectsClient from "./ProjectsClient";
import type { Metadata } from "next";

// Explicit 5-min revalidate ensures page refreshes even without GitHub credentials.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse my GitHub repositories for software engineering, audio programming, and web development projects.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await getRoutableProjects();
  const githubProfileUrl = getGitHubProfileUrl();
  const defaultSort = projects.some((project) => project.content)
    ? "featured"
    : "newest";

  return (
    <div className="pb-24 sm:pb-32">
      <PageHeader title="Projects">
        My open-source GitHub repos: interactive web apps, full-stack
        applications, audio tools, and games - including collaborative team
        projects.
      </PageHeader>

      <div className={CONTAINER}>
        <ProjectsClient projects={projects} defaultSort={defaultSort} />

        {githubProfileUrl && (
          <div className="mt-20 flex justify-center">
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={BUTTON_SECONDARY}
            >
              <SiGithub size={18} aria-hidden="true" />
              View more on GitHub
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
