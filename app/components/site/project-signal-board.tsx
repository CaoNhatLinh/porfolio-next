"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  Circuitry,
  CirclesFour,
  Cube,
  DeviceMobile,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { Locale, Project } from "../../features/content/types";
import { localized } from "../../features/content/types";

type ProjectLens = "all" | "product" | "systems" | "mobile";

const lenses = [
  { id: "all", icon: CirclesFour, vi: "Toàn bộ", en: "All projects" },
  { id: "product", icon: Cube, vi: "Sản phẩm", en: "Product work" },
  { id: "systems", icon: Circuitry, vi: "Hệ thống", en: "Systems" },
  { id: "mobile", icon: DeviceMobile, vi: "Di động", en: "Mobile" },
] as const;

type ProjectSignalBoardProps = {
  projects: Project[];
  locale: Locale;
};

export function ProjectSignalBoard({
  projects,
  locale,
}: ProjectSignalBoardProps) {
  const copy = locale === "vi";
  const reduceMotion = useReducedMotion();
  const [lens, setLens] = useState<ProjectLens>("all");
  const visibleProjects = useMemo(
    () => projectsForLens(projects, lens),
    [projects, lens],
  );
  const [selectedSlug, setSelectedSlug] = useState(
    () => visibleProjects[0]?.slug ?? "",
  );
  const selectedProject =
    visibleProjects.find((project) => project.slug === selectedSlug) ??
    visibleProjects[0];

  if (projects.length === 0) return null;

  function selectLens(nextLens: ProjectLens) {
    const nextProjects = projectsForLens(projects, nextLens);
    setLens(nextLens);
    setSelectedSlug(nextProjects[0]?.slug ?? "");
  }

  return (
    <section className="page-width py-24 md:py-36">
      <div className="signal-board">
        <div className="signal-board-intro">
          <p className="editorial-kicker text-[var(--accent)]">
            {copy ? "Khám phá dự án" : "Browse projects"}
          </p>
          <h2 className="display mt-5 max-w-xl text-5xl font-bold leading-[.86] md:text-7xl">
            {copy ? "Xem theo loại dự án." : "Browse by project type."}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            {copy
              ? "Chọn web, hệ thống hoặc mobile, rồi mở dự án bạn muốn xem."
              : "Choose a category, then open a project to read about the implementation."}
          </p>
          <div
            className="mt-9 grid gap-2"
            role="group"
            aria-label={copy ? "Loại dự án" : "Project categories"}
          >
            {lenses.map(({ id, icon: Icon, vi, en }) => (
              <button
                key={id}
                type="button"
                aria-pressed={lens === id}
                className={`signal-lens focus-ring ${lens === id ? "is-active" : ""}`}
                onClick={() => selectLens(id)}
              >
                <Icon size={18} weight={lens === id ? "fill" : "regular"} />
                <span>{copy ? vi : en}</span>
                <span className="mono ml-auto text-[10px] opacity-60">
                  {projectsForLens(projects, id).length}
                </span>
              </button>
            ))}
          </div>
          {lens !== "all" && (
            <button
              type="button"
              className="signal-reset focus-ring"
              onClick={() => selectLens("all")}
            >
              <ArrowCounterClockwise size={15} />
              {copy ? "Xem lại toàn bộ" : "Show all projects"}
            </button>
          )}
        </div>

        <div className="signal-board-stage">
          <div className="signal-orbit signal-orbit-large" />
          <div className="signal-orbit signal-orbit-small" />
          <div
            className="signal-board-nodes"
            aria-label={
              copy
                ? "Dự án trong nhóm đã chọn"
                : "Projects in the selected category"
            }
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.map((project, index) => (
                <motion.button
                  key={project.slug}
                  type="button"
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.24,
                    delay: reduceMotion ? 0 : index * 0.04,
                  }}
                  onClick={() => setSelectedSlug(project.slug)}
                  className={`signal-node focus-ring ${project.slug === selectedProject?.slug ? "is-selected" : ""}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{project.title}</strong>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {selectedProject ? (
            <motion.article
              key={selectedProject.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              className="signal-project-preview"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/15 bg-black/20">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 42vw"
                  className={
                    selectedProject.imageFit === "contain"
                      ? "object-contain p-5"
                      : "object-cover"
                  }
                />
              </div>
              <div className="p-5 md:p-6">
                <div className="project-meta text-white/45">
                  <span>{selectedProject.category}</span>
                  <span>{selectedProject.year}</span>
                </div>
                <h3 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                  {selectedProject.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
                  {localized(selectedProject.summary, locale)}
                </p>
                <Link
                  href={`/work/${selectedProject.slug}?lang=${locale}`}
                  className="button-accent focus-ring mt-6 text-sm"
                >
                  {copy ? "Mở case study" : "Open case study"}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.article>
            ) : (
              <p key="empty" role="status" className="signal-project-preview p-8 text-white/65">
                {copy ? "Chưa có dự án thuộc nhóm này. Bạn có thể chọn nhóm khác hoặc xem toàn bộ." : "No projects in this category yet. Choose another lens or reset the board."}
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function projectsForLens(projects: Project[], lens: ProjectLens): Project[] {
  if (lens === "all") return projects;
  if (lens === "product")
    return projects.filter(
      (project) =>
        project.category === "Web application" ||
        project.category === "Mobile application",
    );
  if (lens === "systems")
    return projects.filter((project) => project.category === "Backend system");
  return projects.filter(
    (project) => project.category === "Mobile application",
  );
}
