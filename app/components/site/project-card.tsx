import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Locale, Project } from "../../features/content/types";
import { localized } from "../../features/content/types";

export function ProjectCard({
  project,
  locale,
  featured = false,
}: {
  project: Project;
  locale: Locale;
  featured?: boolean;
}) {
  if (featured)
    return (
      <Link
        href={`/work/${project.slug}?lang=${locale}`}
        className="group grid gap-5 md:grid-cols-[1.45fr_.55fr] md:items-end"
      >
        <div className="media-frame aspect-[16/10] md:aspect-[1.72/1]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(min-width: 768px) 65vw, 100vw"
            className={project.imageFit === "contain" ? "object-contain p-5" : "object-cover"}
          />
        </div>
        <div className="border-t border-white/20 pt-4 md:pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mono text-[10px] uppercase opacity-60">
                {project.category} / {project.year}
              </p>
              <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                {project.title}
              </h3>
              <p className="mt-3 text-sm font-medium text-white/75">
                {localized(project.role, locale)}
              </p>
              <p className="muted mt-3 max-w-sm text-sm leading-relaxed">
                {localized(project.summary, locale)}
              </p>
            </div>
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-current transition-transform group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <p className="mt-7 border-t border-white/15 pt-4 text-sm leading-relaxed text-white/70">
            {localized(project.outcome, locale)}
          </p>
        </div>
      </Link>
    );
  return (
    <Link href={`/work/${project.slug}?lang=${locale}`} className="group block">
      <div className="media-frame aspect-[4/3]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className={project.imageFit === "contain" ? "object-contain p-5" : "object-cover"}
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="mono text-[10px] uppercase opacity-60">
            {project.category} / {project.year}
          </p>
          <h3 className="mt-2 text-2xl font-medium tracking-tight">
            {project.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-white/75">
            {localized(project.role, locale)}
          </p>
          <p className="muted mt-2 max-w-md text-sm leading-relaxed">
            {localized(project.summary, locale)}
          </p>
        </div>
        <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-current transition-transform group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
