import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminUser } from "../../lib/auth/admin";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";
import { readImageDimensions } from "../../lib/media/dimensions";
import { validateUpload, MAX_UPLOAD_BYTES, uploadTypes } from "../../lib/media/upload-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !uploadTypes.has(file.type) || file.size < 1 || file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Chọn ảnh hoặc PDF, tối đa 4 MB." } }, { status: 422 });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    let ext: string;
    try { ext = validateUpload(file, buffer); } catch (error) { return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: error instanceof Error ? error.message : "File không hợp lệ." } }, { status: 422 }); }
    const path = `${user.id}/${randomUUID()}.${ext}`;
    const dimensions = file.type === "application/pdf" ? {} : readImageDimensions(buffer);
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage.from("portfolio-media").upload(path, buffer, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
    const { data: asset, error: metadataError } = await supabase.from("media_assets").insert({ owner_id: user.id, storage_key: path, url: data.publicUrl, mime_type: file.type, byte_size: file.size, original_name: file.name.slice(0, 240), width: dimensions.width ?? null, height: dimensions.height ?? null, alt_text: String(form?.get("altText") ?? "").trim().slice(0, 240) }).select("id").single();
    if (metadataError) {
      const { error: cleanupError } = await supabase.storage.from("portfolio-media").remove([path]);
      if (cleanupError) console.error("media_upload_cleanup_failed");
      throw metadataError;
    }
    return NextResponse.json({ ok: true, data: { id: asset?.id, path, url: data.publicUrl } }, { status: 201 });
  } catch (error) {
    console.error("media_upload_failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Không tải được file. Kiểm tra bucket và migration 0008." } }, { status: 500 });
  }
}

