import { z } from "zod";
export function listParams(params: { page?: string; q?: string; status?: string }) {
  const parsedPage = z.coerce.number().int().min(1).max(10000).safeParse(params.page ?? 1);
  const status = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "NEW", "READ", "REPLIED"]).safeParse(params.status);
  return { page: parsedPage.success ? parsedPage.data : 1, q: (params.q ?? "").trim().slice(0, 100), status: status.success ? status.data : "" };
}
export function searchPattern(query: string) { return `%${query.replace(/[\\%_]/g, "\\$&")}%`; }
