"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Rows, SquaresFour } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useMemo, useState, type PointerEvent } from "react";
import type { Locale, Project } from "../../features/content/types";
import { localized } from "../../features/content/types";

const filters = [
  "All",
  "Web application",
  "Mobile application",
  "Backend system",
  "Experiment",
] as const;
type Category = (typeof filters)[number];
type View = "grid" | "list";

const filterLabel = (filter: Category, locale: Locale) => {
  if (locale === "en") return filter;
  return {
    All: "Tất cả",
    "Web application": "Web",
    "Mobile application": "Mobile",
    "Backend system": "Backend",
    Experiment: "Thử nghiệm",
  }[filter];
};

type WorkBrowserProps = {
  locale: Locale;
  projects: Project[];
  initialCategory: string | undefined;
  initialView: string | undefined;
};

export function WorkBrowser({
  locale,
  projects,
  initialCategory,
  initialView,
}: WorkBrowserProps) {
  const copy = locale === "vi";
  const [category, setCategory] = useState<Category>(
    filters.includes(initialCategory as Category)
      ? (initialCategory as Category)
      : "All",
  );
  const [view, setView] = useState<View>(
    initialView === "list" ? "list" : "grid",
  );
  const visible = useMemo(
    () =>
      category === "All"
        ? projects
        : projects.filter((project) => project.category === category),
    [category, projects],
  );
  const featured = visible.find((project) => project.isFeatured);
  const rest = visible;

  const updateUrl = useCallback(
    (nextCategory: Category, nextView: View) => {
      const search = new URLSearchParams({ lang: locale, view: nextView });
      if (nextCategory !== "All") search.set("category", nextCategory);
      window.history.replaceState(null, "", `/work?${search.toString()}`);
    },
    [locale],
  );

  function selectCategory(nextCategory: Category) {
    setCategory(nextCategory);
    updateUrl(nextCategory, view);
  }

  function selectView(nextView: View) {
    setView(nextView);
    updateUrl(category, nextView);
  }

  return (
    <>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-y border-black/15 py-4">
        <div
          className="flex flex-wrap gap-x-2 gap-y-2"
          aria-label={copy ? "Lọc dự án" : "Filter projects"}
        >
          {filters.map((filter) => {
            const active = filter === category;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => selectCategory(filter)}
                aria-pressed={active}
                className={`focus-ring relative isolate rounded-full px-3 py-2 text-sm transition-colors ${active ? "font-semibold text-[var(--accent-ink)]" : "text-black/55 hover:bg-black/5 hover:text-black"}`}
              >
                {active && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {filterLabel(filter, locale)}
              </button>
            );
          })}
        </div>
        <div
          className="flex items-center gap-1 rounded-full border border-black/15 p-1 text-xs"
          aria-label={copy ? "Kiểu hiển thị" : "View mode"}
        >
          <ViewButton
            active={view === "grid"}
            label={copy ? "Xem dạng lưới" : "Grid view"}
            onClick={() => selectView("grid")}
          >
            <SquaresFour size={16} weight="bold" />
          </ViewButton>
          <ViewButton
            active={view === "list"}
            label={copy ? "Xem dạng danh sách" : "List view"}
            onClick={() => selectView("list")}
          >
            <Rows size={16} weight="bold" />
          </ViewButton>
        </div>
      </div>

      {featured && (
        <section className="pb-24 pt-16 md:pb-36">
          <p className="editorial-kicker mb-4 text-black/50">
            {copy ? "Dự án nổi bật" : "Featured project"}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeaturedProject project={featured} locale={locale} copy={copy} />
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      <section className="pb-28 md:pb-44">
        <div className="flex items-end justify-between gap-6 border-b border-black/15 pb-5">
          <div>
            <p className="editorial-kicker text-black/50">
              {copy ? "Thư viện" : "The archive"}
            </p>
            <h2 className="display mt-4 text-5xl font-bold leading-[.84] md:text-7xl">
              {copy ? "Tất cả dự án" : "All projects"}
            </h2>
          </div>
          <span className="mono text-xs text-black/50">
            {visible.length} {copy ? "dự án" : "projects"}
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          {rest.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-lg text-black/55"
            >
              {copy
                ? "Chưa có dự án nào khác trong nhóm này."
                : "No other projects in this category yet."}
            </motion.p>
          ) : view === "list" ? (
            <motion.div key="list" layout className="mt-2">
              {rest.map((project, index) => (
                <ListProject
                  key={project.slug}
                  project={project}
                  index={index}
                  locale={locale}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="mt-10 grid items-start gap-x-8 gap-y-16 md:grid-cols-12"
            >
              {rest.map((project, index) => (
                <ArchiveProject
                  key={project.slug}
                  project={project}
                  index={index}
                  locale={locale}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring grid h-8 w-8 place-items-center rounded-full transition-colors ${active ? "bg-[var(--ink)] text-[var(--paper)]" : "text-black/50 hover:text-black"}`}
    >
      {children}
    </button>
  );
}

function FeaturedProject({
  project,
  locale,
  copy,
}: {
  project: Project;
  locale: Locale;
  copy: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}?lang=${locale}`}
      className="group grid overflow-hidden rounded-[18px] bg-[var(--ink)] text-[var(--paper)] md:grid-cols-[.43fr_1fr]"
    >
      <div className="flex min-h-[24rem] flex-col justify-between p-7 md:min-h-[34rem] md:p-12">
        <div>
          <div className="project-meta text-white/45">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="display mt-10 max-w-sm text-5xl font-bold leading-[.84] md:text-6xl">
            {project.title}
          </h3>
          <p className="mt-5 text-sm font-medium text-white/80">
            {localized(project.role, locale)}
          </p>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/60">
            {localized(project.summary, locale)}
          </p>
        </div>
        <div className="mt-12">
          <p className="mono text-xs uppercase tracking-[.12em] text-white/45">
            {copy ? "Điểm đáng chú ý" : "What changed"}
          </p>
          <p className="mt-2 max-w-xs text-lg leading-tight text-white/90">
            {localized(project.outcome, locale)}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--accent)]">
            {copy ? "Mở case study" : "Open case study"}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </span>
        </div>
      </div>
      <ProjectVisual project={project} large />
    </Link>
  );
}

function ArchiveProject({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  const large = index % 4 === 0;
  const tall = index % 4 === 1;
  const position = large
    ? "md:col-span-7"
    : tall
      ? "md:col-span-5 md:mt-20"
      : index % 4 === 2
        ? "md:col-span-5"
        : "md:col-span-7 md:mt-14";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.24,
        delay: Math.min(index * 0.035, 0.16),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={position}
    >
      <PointerProjectLink
        project={project}
        locale={locale}
        tall={tall}
        large={large}
      />
    </motion.article>
  );
}

function PointerProjectLink({
  project,
  locale,
  tall,
  large,
}: {
  project: Project;
  locale: Locale;
  tall: boolean;
  large: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 24, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 240, damping: 24, mass: 0.4 });
  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - box.left) / box.width - 0.5) * 8);
    y.set(((event.clientY - box.top) / box.height - 0.5) * 8);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <Link
      href={`/work/${project.slug}?lang=${locale}`}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      className="group block focus-ring"
    >
      <motion.div style={{ x: springX, y: springY }}>
        <ProjectVisual project={project} tall={tall} large={large} />
        <div className="mt-5 flex items-start justify-between gap-5">
          <div>
            <div className="project-meta">
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
            <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-3 text-sm font-medium text-black/75">
              {localized(project.role, locale)}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-black/60">
              {localized(project.outcome, locale)}
            </p>
          </div>
          <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/20 transition-transform group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

function ProjectVisual({
  project,
  tall = false,
  large = false,
}: {
  project: Project;
  tall?: boolean;
  large?: boolean;
}) {
  const ratio = tall
    ? "aspect-[4/5]"
    : large
      ? "aspect-[16/10]"
      : "aspect-[5/4]";
  return (
    <div className={`project-art ${ratio}`}>
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes={
          large
            ? "(min-width: 768px) 60vw, 100vw"
            : "(min-width: 768px) 55vw, 100vw"
        }
        className={
          project.imageFit === "contain" ? "object-contain p-5" : "object-cover"
        }
      />
    </div>
  );
}

function ListProject({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.03, 0.15) }}
    >
      <Link
        href={`/work/${project.slug}?lang=${locale}`}
        className="project-index-row group focus-ring"
      >
        <span className="mono text-xs opacity-45">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-2xl font-medium tracking-tight">
          {project.title}
        </span>
        <span className="text-sm opacity-55">
          <span className="block font-medium text-black/70">
            {localized(project.role, locale)}
          </span>
          {localized(project.outcome, locale)}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-black/20 transition-transform group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </span>
      </Link>
    </motion.div>
  );
}
