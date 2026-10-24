import { NextResponse } from "next/server";
import { getAdminUser } from "../../../lib/auth/admin";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";
export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
  try {
    const database = createSupabaseAdminClient();
    const content: Record<string, unknown[]> = {};
    for (const table of ["site_profile", "projects", "articles", "resume_entries", "lab_items", "media_assets"]) {
      content[table] = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await database.from(table).select("*").eq("owner_id", user.id).order("id").range(offset, offset + 499);
        if (error) throw error;
        content[table].push(...(data ?? [])); if (!data || data.length < 500) break;
      }
    }
    return new NextResponse(JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), content }, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="kamling-content-${new Date().toISOString().slice(0, 10)}.json"`, "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Không xuất được dữ liệu." } }, { status: 500 }); }
}
