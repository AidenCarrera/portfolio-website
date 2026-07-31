import { ExternalLink, Folder } from "lucide-react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import type { PortfolioProject } from "@/lib/projects";
import { formatTagName } from "@/lib/utils";

interface RepoCardProps {
  project: PortfolioProject;
}

export default function RepoCard({ project }: RepoCardProps) {
  const { github, presentation, slug } = project;

  return (
    <li className="relative h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/60 transition-all group flex flex-col">
      <Link
        href={`/projects/${slug}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none"
        aria-label={`View project details for ${presentation.repoName}`}
      >
        <span className="sr-only">
          View project details for {presentation.repoName}
        </span>
      </Link>

      <div className="relative z-20 pointer-events-none flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-brand/10 to-brand-dark/5 border border-brand/20 flex items-center justify-center shadow-inner">
            <Folder
              size={18}
              className="text-brand filter drop-shadow-[0_2px_6px_rgba(0,255,204,0.25)]"
            />
          </div>
          {presentation.featured && (
            <span className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full animate-pulse">
              Featured
            </span>
          )}
          {github.isCollab && (
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Collab
            </span>
          )}
        </div>

        <div className="flex space-x-2 pointer-events-auto">
          <a
            href={github.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title="View GitHub Repository"
            aria-label={`View GitHub repository for ${presentation.repoName}`}
          >
            <SiGithub size={20} />
          </a>
          {github.homepage && github.homepage.trim() !== "" && (
            <a
              href={
                github.homepage.startsWith("http")
                  ? github.homepage
                  : `https://${github.homepage}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-brand hover:bg-slate-700/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title="View Live Site"
              aria-label={`View live site for ${presentation.repoName}`}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      <h3 className="pointer-events-none text-xl font-semibold text-white mb-2 group-hover:text-brand transition-colors">
        {presentation.repoName}
      </h3>

      <p className="pointer-events-none text-slate-400 text-sm mb-4 line-clamp-3">
        {presentation.cardDescription}
      </p>

      <ul className="pointer-events-none flex flex-wrap gap-2">
        {presentation.tags.map((tech) => (
          <li
            key={tech}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300"
          >
            {formatTagName(tech)}
          </li>
        ))}
      </ul>
    </li>
  );
}
