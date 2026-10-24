import { NextResponse } from "next/server";
import { getAdminUser } from "../../lib/auth/admin";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";
export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(10000, Number(params.get("page")) || 1));
  try {
    let query = createSupabaseAdminClient().from("media_assets").select("id, url, mime_type, alt_text, original_name", { count: "exact" }).eq("owner_id", user.id).order("created_at", { ascending: false });
    if (params.get("type") !== "all") query = query.like("mime_type", "image/%");
    const { data, count, error } = await query.range((page - 1) * 20, page * 20 - 1);
    if (error) throw error;
    return NextResponse.json({ data, count }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Không tải được thư viện ảnh." } }, { status: 500 }); }
}
