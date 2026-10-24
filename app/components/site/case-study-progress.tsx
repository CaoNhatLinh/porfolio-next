"use client";

import { useEffect, useState } from "react";
import type { Locale, LocalizedText } from "../../features/content/types";
import { localized } from "../../features/content/types";

type CaseStudyProgressProps = {
  locale: Locale;
  sections: { id: string; heading: LocalizedText }[];
};

export function CaseStudyProgress({
  locale,
  sections,
}: CaseStudyProgressProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const copy = locale === "vi";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          )[0];

        if (current) setActiveId(current.target.id);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0.1, 0.5] },
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav
      className="case-progress"
      aria-label={copy ? "Mục lục case study" : "Case study chapters"}
    >
      <span className="editorial-kicker text-white/45">
        {copy ? "Trong bài này" : "On this page"}
      </span>
      <ol>
        {sections.map((section, index) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "location" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {localized(section.heading, locale)}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
