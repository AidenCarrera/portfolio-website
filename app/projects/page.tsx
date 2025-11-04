"use client";

import { useEffect, useState } from "react";
import { Code2, Github, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/common";
import { RepoGrid, CategoryFilter } from "@/components/projects";
import { GithubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch("/api/github-repos");
        const data: GithubRepo[] = await res.json();
        setRepos(data);
      } catch (err) {
        console.error("Failed to fetch repos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(repos.flatMap((r) => r.topics.map((t) => t.toLowerCase())))),
  ];

  const filteredRepos =
    selectedCategory === "all"
      ? repos
      : repos.filter((r) =>
          r.topics.map((t) => t.toLowerCase()).includes(selectedCategory)
        );

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <Navigation />

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
            My GitHub repositories: software projects, AI experiments, interactive web apps, audio tools, and games — including projects I&apos;ve collaborated on.
          </p>
        </div>

        {/* Category Filter */}
        {repos.length > 0 && !loading && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        {/* Repo Grid */}
        <RepoGrid repos={filteredRepos} loading={loading} />

        {/* GitHub Link */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/aidencarrera"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center space-x-2 text-brand hover:text-brand-light transition-colors"
            )}
          >
            <Github size={20} />
            <span className="font-medium">View more on GitHub</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
