import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({ result: { data: [] as Record<string, unknown>[], error: null as null | { message: string } } }));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => {
    const query = { select: () => query, eq: () => query, order: () => query, then: (resolve: (value: typeof database.result) => unknown) => Promise.resolve(database.result).then(resolve) };
    return query;
  } }),
}));
import { getPublicArticles, getPublicProjects } from "../app/features/content/repository";

describe("published content is authoritative", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key");
    database.result = { data: [], error: null };
  });
  afterEach(() => vi.unstubAllEnvs());

  it("does not restore fixtures after the last project or article is unpublished", async () => {
    expect(await getPublicProjects()).toEqual([]);
    expect(await getPublicArticles()).toEqual([]);
  });

  it("surfaces a database failure instead of showing stale published fixtures", async () => {
    database.result.error = { message: "unavailable" };
    await expect(getPublicProjects()).rejects.toThrow("Unable to load published projects");
    await expect(getPublicArticles()).rejects.toThrow("Unable to load published articles");
  });

  it("does not borrow another project's role, links or case study", async () => {
    database.result.data = [{ slug: "new-project", title: "New project", content: [] }];
    const [project] = await getPublicProjects();
    expect(project.role).toEqual({ vi: "", en: "" });
    expect(project.links).toEqual([]);
    expect(project.sections).toEqual([]);
  });

  it("honors deliberately cleared sections and optional bilingual copy", async () => {
    database.result.data = [{ slug: "zing-music", title: "Zing Music", content: [], team_context: { vi: "", en: "" } }];
    const [project] = await getPublicProjects();
    expect(project.sections).toEqual([]);
    expect(project.teamContext).toEqual({ vi: "", en: "" });
  });
});
