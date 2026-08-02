import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Download,
  Globe2,
  Link2,
  Mail,
  MapPin,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import { getResumePage } from "@/lib/resume";
import type { ResumeContactIcon } from "@/sanity/types";

export const revalidate = 3600;

const labels = {
  download: "Download PDF",
  education: "Education",
  gpa: "GPA",
  coursework: "Coursework",
  honors: "Honors",
  projects: "Selected Projects",
  projectLink: "GitHub",
  viewAllProjects: "View All Projects",
  experience: "Experience & Leadership",
  skills: "Skills",
} as const;

const allProjectsUrl = "/projects";

export async function generateMetadata(): Promise<Metadata> {
  const resume = await getResumePage();

  return {
    title: { absolute: resume ? `Resume | ${resume.name}` : "Resume" },
    description: resume?.seoDescription?.trim() || resume?.summary,
    alternates: {
      canonical: "/resume",
    },
  };
}

const sectionHeadingClass =
  "text-2xl sm:text-3xl font-bold text-white";

function ContactIcon({ icon }: { icon: ResumeContactIcon }) {
  switch (icon) {
    case "github":
      return <SiGithub size={17} aria-hidden="true" />;
    case "linkedin":
      return <FaLinkedin size={17} aria-hidden="true" />;
    case "email":
      return <Mail size={17} aria-hidden="true" />;
    case "website":
      return <Globe2 size={17} aria-hidden="true" />;
    default:
      return <Link2 size={17} aria-hidden="true" />;
  }
}

export default async function ResumePage() {
  const resume = await getResumePage();

  if (!resume) {
    notFound();
  }

  const allProjectsClassName =
    "inline-flex items-center justify-center rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:border-brand/60 hover:bg-brand/15 hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-800/70 p-6 shadow-2xl shadow-black/20 sm:p-10">
          <div className="relative">
            <div className="mb-5 inline-flex items-center rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
              {resume.eyebrow}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {resume.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              {resume.summary}
            </p>
          </div>

          <div className="relative mt-8 flex flex-col gap-4 border-t border-slate-700/80 pt-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-3">
              {resume.contactLinks.map((contact) => {
                const external = /^https?:\/\//i.test(contact.url);

                return (
                  <a
                    key={contact._key}
                    href={contact.url}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-brand/50 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <ContactIcon icon={contact.icon} />
                    {contact.label}
                  </a>
                );
              })}
            </div>
            {resume.downloadUrl && (
              <a
                href={resume.downloadUrl}
                download
                className="inline-flex w-fit shrink-0 items-center justify-center gap-2 self-end rounded-xl bg-linear-to-r from-brand-dark to-brand-darker px-5 py-3 font-semibold text-white shadow-lg shadow-brand/10 transition-transform hover:-translate-y-0.5 hover:from-brand hover:to-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:ml-auto sm:self-auto"
              >
                <Download size={19} aria-hidden="true" />
                {labels.download}
              </a>
            )}
          </div>
        </header>

        <div className="mt-10 space-y-10">
          <section
            aria-labelledby="education-heading"
            className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 sm:p-8"
          >
            <h2 id="education-heading" className={sectionHeadingClass}>
              {labels.education}
            </h2>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {resume.education.school}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-slate-400">
                  <MapPin size={16} aria-hidden="true" />
                  {resume.education.location}
                </p>
                <p className="mt-4 text-lg font-semibold text-brand">
                  {resume.education.degree}
                </p>
                <p className="text-slate-300">{resume.education.graduation}</p>
              </div>
              <div className="w-fit rounded-xl border border-brand/20 bg-brand/10 px-5 py-4 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                  {labels.gpa}
                </p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {resume.education.gpa}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-6 border-t border-slate-700/80 pt-7 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-white">
                  {labels.coursework}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resume.education.coursework.map((course) => (
                    <span
                      key={course}
                      className="rounded-md border border-slate-700 bg-slate-900/60 px-2.5 py-1 text-sm text-slate-300"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {labels.honors}
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                  {resume.education.honors.map((honor) => (
                    <li key={honor} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {honor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="projects-heading">
            <h2 id="projects-heading" className={sectionHeadingClass}>
              {labels.projects}
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {resume.projects.map((project, index) => (
                <article
                  key={project._key}
                  className={`group rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 transition-colors hover:border-brand/40 ${
                    index === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">
                      {project.name}
                    </h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-brand/50 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      aria-label={`${labels.projectLink}: ${project.name}`}
                    >
                      <SiGithub size={17} aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {labels.projectLink}
                      </span>
                    </a>
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-300">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-xs font-medium text-brand-light"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link href={allProjectsUrl} className={allProjectsClassName}>
                {labels.viewAllProjects}
              </Link>
            </div>
          </section>

          <section aria-labelledby="experience-heading">
            <h2 id="experience-heading" className={sectionHeadingClass}>
              {labels.experience}
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/50">
              {resume.experience.map((experience, index) => (
                <article
                  key={experience._key}
                  className={`grid gap-4 p-6 sm:p-7 lg:grid-cols-[1fr_12rem] ${
                    index > 0 ? "border-t border-slate-700/80" : ""
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {experience.role}
                    </h3>
                    <p className="mt-1 font-medium text-brand-light">
                      {experience.organization}
                    </p>
                    {experience.location && (
                      <p className="mt-1 text-sm text-slate-400">
                        {experience.location}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2 text-slate-300">
                      {experience.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3 leading-relaxed">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-mono text-sm text-slate-400 lg:text-right">
                    {experience.dates}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="skills-heading"
            className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 sm:p-8"
          >
            <h2 id="skills-heading" className={sectionHeadingClass}>
              {labels.skills}
            </h2>

            <div className="mt-7 divide-y divide-slate-700/80">
              {resume.skills.map((category) => (
                <div
                  key={category._key}
                  className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-brand">
                    {category.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-200 lg:whitespace-nowrap">
                    {category.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
