import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  Globe2,
  Link2,
  Mail,
  MapPin,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import Reveal from "@/components/common/Reveal";
import ResumeNav from "@/components/resume/ResumeNav";
import { getResumePage } from "@/lib/resume";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CHIP,
  CONTAINER,
} from "@/lib/styles";
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
  unavailable:
    "The full resume is temporarily unavailable. My work is still browsable on the projects page.",
} as const;

const allProjectsUrl = "/projects";

// The scale GPAs are reported on, for the meter under the figure.
const GPA_SCALE = 4;

export async function generateMetadata(): Promise<Metadata> {
  const resume = await getResumePage();

  return {
    title: { absolute: `Resume | ${resume.name}` },
    description: resume.seoDescription?.trim() || resume.summary,
    alternates: {
      canonical: "/resume",
    },
  };
}

function ContactIcon({ icon }: { icon: ResumeContactIcon }) {
  switch (icon) {
    case "github":
      return <SiGithub size={16} aria-hidden="true" />;
    case "linkedin":
      return <FaLinkedin size={16} aria-hidden="true" />;
    case "email":
      return <Mail size={16} aria-hidden="true" />;
    case "website":
      return <Globe2 size={16} aria-hidden="true" />;
    default:
      return <Link2 size={16} aria-hidden="true" />;
  }
}

function ResumeSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    // Clears the fixed nav when reached through the section rail.
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <Reveal>
        <h2
          id={`${id}-heading`}
          className="border-b border-line pb-5 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl"
        >
          {title}
        </h2>
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2.5 pl-5 text-slate-300 marker:text-brand">
      {items.map((item) => (
        <li key={item} className="pl-1.5 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ResumePage() {
  const resume = await getResumePage();

  // With no CMS document the header still reads on its own, but the body
  // would be a column of headings with nothing under them.
  const sections: { id: string; label: string }[] = [];
  if (resume.education) {
    sections.push({ id: "education", label: labels.education });
  }
  if (resume.skills.length > 0) {
    sections.push({ id: "skills", label: labels.skills });
  }
  if (resume.projects.length > 0) {
    sections.push({ id: "projects", label: labels.projects });
  }
  if (resume.experience.length > 0) {
    sections.push({ id: "experience", label: labels.experience });
  }

  const gpa = Number.parseFloat(resume.education?.gpa ?? "");
  const gpaFill =
    Number.isFinite(gpa) && gpa > 0 && gpa <= GPA_SCALE
      ? (gpa / GPA_SCALE) * 100
      : null;

  return (
    <div className="pb-24 sm:pb-32">
      <header>
        <div className={`${CONTAINER} pt-14 pb-14 sm:pt-20 sm:pb-20`}>
          <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <h1 className="text-title text-white">{resume.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
                {resume.summary}
              </p>
            </div>

            {(resume.contactLinks.length > 0 || resume.downloadUrl) && (
              <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end">
                {resume.contactLinks.length > 0 && (
                  <ul className="flex flex-wrap gap-2 lg:justify-end">
                    {resume.contactLinks.map((contact) => {
                      const external = /^https?:\/\//i.test(contact.url);

                      return (
                        <li key={contact._key}>
                          <a
                            href={contact.url}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-slate-300 transition-colors hover:border-brand/50 hover:text-brand"
                          >
                            <ContactIcon icon={contact.icon} />
                            {contact.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {resume.downloadUrl && (
                  <a
                    href={resume.downloadUrl}
                    download
                    className={`${BUTTON_PRIMARY} self-start lg:self-end`}
                  >
                    <Download
                      size={17}
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5"
                    />
                    {labels.download}
                  </a>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </header>

      <div className={CONTAINER}>
        {sections.length === 0 ? (
          <div className="panel rounded-2xl p-8 text-center sm:p-12">
            <p className="mx-auto max-w-2xl leading-relaxed text-slate-300">
              {labels.unavailable}
            </p>
            <Link href={allProjectsUrl} className={`${BUTTON_SECONDARY} mt-6`}>
              {labels.viewAllProjects}
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <ResumeNav sections={sections} />
              </div>
            </aside>

            <div className="space-y-20 sm:space-y-24 lg:col-span-9">
              {resume.education && (
                <ResumeSection id="education" title={labels.education}>
                  <Reveal className="relative panel rounded-2xl p-6 sm:p-8">
                    <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                          {resume.education.school}
                        </h3>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                          <MapPin size={15} aria-hidden="true" />
                          {resume.education.location}
                        </p>
                        <p className="mt-5 text-lg font-medium text-brand">
                          {resume.education.degree}
                        </p>
                        <p className="mt-1 text-slate-400">
                          {resume.education.graduation}
                        </p>
                      </div>

                      {/* GPA as a meter reading: the figure, and a bar for
                          where it sits on the scale. */}
                      <div className="w-full rounded-xl border border-brand/20 bg-brand/[0.05] px-5 py-4 sm:w-44">
                        <p className="eyebrow text-brand">{labels.gpa}</p>
                        <p className="mt-2 font-mono text-4xl font-semibold tracking-tight text-white">
                          {resume.education.gpa}
                        </p>
                        {gpaFill !== null && (
                          <div
                            aria-hidden="true"
                            className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.08]"
                          >
                            <div
                              className="h-full rounded-full bg-linear-to-r from-brand-dark to-brand shadow-[0_0_10px_var(--color-brand)]"
                              style={{ width: `${gpaFill}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
                      <div>
                        <h4 className="eyebrow text-muted">
                          {labels.coursework}
                        </h4>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {resume.education.coursework.map((course) => (
                            <li key={course} className={CHIP}>
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="eyebrow text-muted">{labels.honors}</h4>
                        <div className="mt-4 text-sm">
                          <Bullets items={resume.education.honors} />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </ResumeSection>
              )}

              {resume.skills.length > 0 && (
                <ResumeSection id="skills" title={labels.skills}>
                  <dl className="divide-y divide-line">
                    {resume.skills.map((category) => (
                      <Reveal
                        key={category._key}
                        className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[11rem_1fr] sm:gap-8"
                      >
                        <dt className="font-medium text-brand">
                          {category.name}
                        </dt>
                        <dd className="leading-relaxed text-slate-300">
                          {category.items.join(", ")}
                        </dd>
                      </Reveal>
                    ))}
                  </dl>
                </ResumeSection>
              )}

              {resume.projects.length > 0 && (
                <ResumeSection id="projects" title={labels.projects}>
                  <div className="grid gap-4">
                    {resume.projects.map((project) => (
                      <Reveal key={project._key}>
                        <article className="relative panel rounded-2xl p-6 sm:p-7">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                              {project.name}
                            </h3>
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-brand/50 hover:text-brand"
                              aria-label={`${labels.projectLink}: ${project.name}`}
                            >
                              <SiGithub size={15} aria-hidden="true" />
                              <span className="hidden sm:inline">
                                {labels.projectLink}
                              </span>
                            </a>
                          </div>
                          <div className="mt-4">
                            <Bullets items={project.highlights} />
                          </div>
                          <ul className="mt-5 flex flex-wrap gap-1.5">
                            {project.technologies.map((technology) => (
                              <li key={technology} className={CHIP}>
                                {technology}
                              </li>
                            ))}
                          </ul>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                  <Link
                    href={allProjectsUrl}
                    className="group mt-8 inline-flex items-center gap-2 rounded-sm font-medium text-brand transition-colors hover:text-brand-pale"
                  >
                    {labels.viewAllProjects}
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                    />
                  </Link>
                </ResumeSection>
              )}

              {resume.experience.length > 0 && (
                <ResumeSection id="experience" title={labels.experience}>
                  {/* One card, the positions ruled apart inside it. */}
                  <Reveal>
                    <ol className="panel divide-y divide-line rounded-2xl px-6 sm:px-7">
                      {resume.experience.map((experience) => (
                        <li key={experience._key} className="py-6 sm:py-7">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                            <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                              {experience.role}
                            </h3>
                            <p className="eyebrow shrink-0 text-muted">
                              {experience.dates}
                            </p>
                          </div>
                          <p className="mt-1 font-medium text-brand">
                            {experience.organization}
                            {experience.location && (
                              <span className="font-normal text-muted">
                                {" "}
                                · {experience.location}
                              </span>
                            )}
                          </p>
                          <div className="mt-4">
                            <Bullets items={experience.highlights} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  </Reveal>
                </ResumeSection>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
