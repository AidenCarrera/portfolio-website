import { Code2, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { getGithubRepos } from "@/lib/github";
import { cn } from "@/lib/utils";
import ProjectsClient from "./ProjectsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse my GitHub repositories for software engineering, audio programming, and web development projects.",
};

// Server component — direct server-side data fetching
export default async function ProjectsPage() {
  const repos = await getGithubRepos();

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <Code2 size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            My GitHub repositories: software projects, AI experiments,
            interactive web apps, audio tools, and games — including projects
            I&apos;ve collaborated on.
          </p>
        </div>

        {/* Client side category filtering and grid */}
        <ProjectsClient initialRepos={repos} />

        {/* GitHub Link */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/aidencarrera"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center space-x-2 text-brand hover:text-brand-light transition-colors",
            )}
          >
            <SiGithub size={20} />
            <span className="font-medium">View more on GitHub</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
