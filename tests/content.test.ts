import { describe, expect, it } from "vitest";
import { articles, getLocale, projects } from "../app/features/content/data";
import { existsSync } from "node:fs";
import { articleStarters, getArticleStarter } from "../app/features/content/article-starters";

describe("portfolio content fixtures", () => {
  it("keeps Vietnamese as the default locale and accepts English", () => {
    expect(getLocale()).toBe("vi");
    expect(getLocale("en")).toBe("en");
    expect(getLocale("fr")).toBe("vi");
  });

  it("prioritizes featured projects and keeps bilingual copy", () => {
    expect(projects.filter((project) => project.isFeatured)).toHaveLength(3);
    expect(projects[0]?.isFeatured).toBe(true);
    expect(
      projects.every((project) => project.summary.vi && project.summary.en),
    ).toBe(true);
    expect(
      articles.every(
        (article) =>
          article.title.vi &&
          article.title.en &&
          article.body.vi &&
          article.body.en,
      ),
    ).toBe(true);
  });

  it("does not publish placeholder articles from the source fallback", () => {
    expect(articles).toEqual([]);
  });

  it("prepares private bilingual writing starters with diagrams and code", () => {
    expect(articleStarters).toHaveLength(3);
    for (const starter of articleStarters) {
      expect(starter).not.toHaveProperty("date");
      expect(existsSync(`public${starter.cover.src}`)).toBe(true);
      for (const locale of ["vi", "en"] as const) {
        expect(starter.title[locale]).toBeTruthy();
        expect(starter.body[locale]).toContain("```");
        expect(starter.body[locale]).toContain(`](${starter.cover.src})`);
      }
      expect(getArticleStarter(starter.slug)).toBe(starter);
    }
    expect(getArticleStarter("unknown")).toBeUndefined();
    expect(getArticleStarter("clarity-in-complex-systems")).toBeUndefined();
  });

  it("explains projects without generic self-praise", () => {
    for (const project of projects) {
      const copy = JSON.stringify([project.summary, project.outcome, project.highlights, project.sections]);
      expect(copy).not.toMatch(/năng lực thể hiện|thế mạnh được thể hiện|bề mặt thao tác|strength on display/i);
      expect(project.sections.some((section) => /Tôi |tôi /u.test(section.body.vi))).toBe(true);
    }
  });
});
