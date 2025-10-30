"use client";

import { Github, ExternalLink, Folder } from "lucide-react";
import { getStackIcon } from "@/lib/utils";
import { GithubRepo } from "@/lib/github";

interface RepoCardProps {
  repo: GithubRepo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all group flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-brand-dark/20 transition-colors">
          <Folder size={24} className="text-brand" />
        </div>
        <div className="flex space-x-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-brand hover:bg-slate-700 transition-all"
          >
            <Github size={20} />
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-brand hover:bg-slate-700 transition-all"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand transition-colors">
        {repo.name}
      </h3>

      <p className="text-slate-400 text-sm mb-4 grow">
        {repo.description || "No description"}
      </p>

      <div className="flex flex-wrap gap-2">
        {repo.topics.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300"
          >
            <span>{getStackIcon(tech)}</span>
            <span className="capitalize">{tech.replace(/-/g, " ")}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
