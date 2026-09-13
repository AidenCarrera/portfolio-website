import type { ComponentType } from "react";
import { Database } from "lucide-react";
import {
  SiApachemaven,
  SiCmake,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiDotnet,
  SiElevenlabs,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiJuce,
  SiJupyter,
  SiMariadb,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOllama,
  SiOpengl,
  SiOpenjdk,
  SiPnpm,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiSanity,
  SiSocketdotio,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
  SiWebgl,
} from "react-icons/si";

export type TechIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: true;
}>;

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Match CMS and GitHub names by punctuation-stripped slug.
 * Skills fall back to category icons; tags render as plain pills.
 * Use named imports to keep Next's barrel optimization effective.
 */
const TECH_ICONS: Record<string, TechIcon> = {
  apachemaven: SiApachemaven,
  aspnet: SiDotnet,
  aspnetcore: SiDotnet,
  chromadb: Database,
  cmake: SiCmake,
  cplusplus: SiCplusplus,
  css: SiCss,
  csharp: SiDotnet,
  docker: SiDocker,
  dotnet: SiDotnet,
  elevenlabs: SiElevenlabs,
  express: SiExpress,
  fastapi: SiFastapi,
  git: SiGit,
  github: SiGithub,
  githubactions: SiGithubactions,
  html: SiHtml5,
  html5: SiHtml5,
  java: SiOpenjdk,
  javascript: SiJavascript,
  json: SiJson,
  juce: SiJuce,
  jupyter: SiJupyter,
  mariadb: SiMariadb,
  maven: SiApachemaven,
  mongodb: SiMongodb,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  ollama: SiOllama,
  opengl: SiOpengl,
  pnpm: SiPnpm,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  python: SiPython,
  pytorch: SiPytorch,
  react: SiReact,
  redis: SiRedis,
  sanity: SiSanity,
  socketio: SiSocketdotio,
  // Names a technology rather than a product, so it borrows a generic mark.
  sql: Database,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  threejs: SiThreedotjs,
  typescript: SiTypescript,
  vite: SiVite,
  webgl: SiWebgl,
};

export function getTechIcon(name: string): TechIcon | undefined {
  return TECH_ICONS[toSlug(name)];
}
