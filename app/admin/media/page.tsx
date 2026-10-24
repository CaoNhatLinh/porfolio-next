import { MediaUpload } from "../../components/admin/media-upload";
import { MediaCard, type MediaAsset } from "../../components/admin/media-card";
import { AdminHeading, adminInputClass } from "../../components/admin/fields";
import { Pagination } from "../../components/admin/list-toolbar";
import { ActionForm } from "../../components/admin/action-form";
import { clearResumeAssetAction } from "./actions";
import { cmsActor } from "../cms-access";
import { listParams, searchPattern } from "../list-query";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string }> }) {
  const params = await searchParams; const { page, q } = listParams(params);
  const { user, database } = await cmsActor();
  let query = database.from("media_assets").select("*", { count: "exact" }).eq("owner_id", user.id).order("created_at", { ascending: false });
  if (params.type === "pdf") query = query.eq("mime_type", "application/pdf");
  if (params.type === "image") query = query.like("mime_type", "image/%");
  if (q) query = query.ilike("original_name", searchPattern(q));
  const [{ data, count, error }, profile] = await Promise.all([query.range((page - 1) * 20, page * 20 - 1), database.from("site_profile").select("resume_asset_id, resume_url, resume_updated_at").eq("owner_id", user.id).maybeSingle()]);
  if (error || profile.error) throw new Error("Unable to load media library.");
  return <div><AdminHeading title="Ảnh, tài liệu & CV" description="Tải lên, chọn ảnh khi biên tập và quản lý CV PDF. Không tải tài liệu riêng tư: file ở đây được phục vụ công khai." /><div className="mt-6 grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><MediaUpload pdfOnly={params.type === "pdf"} /><section className="rounded-xl border border-black/15 bg-white/40 p-5"><h2 className="text-lg font-semibold">CV trên website</h2>{profile.data?.resume_url ? <><a href={profile.data.resume_url} target="_blank" rel="noreferrer" className="mt-4 inline-block underline">Mở CV hiện tại ↗</a><p className="mt-2 text-xs text-black/60">Cập nhật: {profile.data.resume_updated_at || "Chưa ghi ngày"}</p><ActionForm action={clearResumeAssetAction} className="mt-4"><button type="submit" className="rounded border border-black/20 px-3 py-2 text-sm">Gỡ CV khỏi website</button></ActionForm></> : <p className="mt-3 text-sm text-black/60">Chưa chọn CV PDF. Tải file lên rồi bấm “Dùng làm CV”. Hãy lưu Hồ sơ trước nếu bạn chưa có bản ghi hồ sơ.</p>}</section></div><form method="get" className="my-6 flex flex-wrap items-end gap-3"><label className="flex-1 text-sm">Tìm tên file<input name="q" defaultValue={q} className={adminInputClass} /></label><label className="text-sm">Định dạng<select name="type" defaultValue={params.type ?? ""} className={adminInputClass}><option value="">Tất cả</option><option value="image">Ảnh</option><option value="pdf">PDF / CV</option></select></label><button className="button-accent">Lọc</button></form><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{!data?.length && <p className="col-span-full rounded border border-dashed border-black/20 p-8 text-sm">Chưa có file phù hợp.</p>}{(data ?? []).map((asset: MediaAsset) => <MediaCard key={asset.id} asset={asset} activeCv={profile.data?.resume_asset_id === asset.id} />)}</div><Pagination page={page} total={count ?? 0} base="/admin/media" params={{ q, type: params.type ?? "" }} /></div>;
}
