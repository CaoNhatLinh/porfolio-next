import { entryFromRow, entryKinds, entryLabels } from "../../features/content/resume-entry";
import { cmsActor } from "../cms-access";
import { listParams, searchPattern } from "../list-query";
import { ResumeEntryForm } from "../../components/admin/resume-entry-form";
import { ContentControls } from "../../components/admin/content-controls";
import { AdminHeading, adminInputClass } from "../../components/admin/fields";
import { ListToolbar, Pagination } from "../../components/admin/list-toolbar";

export const dynamic = "force-dynamic";
export default async function ResumeAdminPage({ searchParams }: { searchParams: Promise<{ kind?: string; status?: string; q?: string; page?: string }> }) {
  const params = await searchParams;
  const kind = entryKinds.find((value) => value === params.kind) ?? "EXPERIENCE";
  const { page, q, status } = listParams(params);
  const { user, database } = await cmsActor();
  let query = database.from("resume_entries").select("*", { count: "exact" }).eq("owner_id", user.id).eq("kind", kind).order("sort_order").order("id");
  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("title->>vi", searchPattern(q));
  const { data, count, error } = await query.range((page - 1) * 20, page * 20 - 1);
  if (error) throw new Error("Không tải được hồ sơ. Kiểm tra migration 0008 và kết nối Supabase.");
  const entries = (data ?? []).map(entryFromRow);
  return <div><AdminHeading title="Kinh nghiệm & năng lực" description="Quản lý nội dung hiển thị trên About, CV và Thuê tôi. Nội dung mới luôn là nháp; bạn xuất bản khi đã kiểm tra." />
    <ListToolbar q={q} status={status} extra={<label className="text-sm">Loại nội dung<select name="kind" defaultValue={kind} className={adminInputClass}>{entryKinds.map((value) => <option key={value} value={value}>{entryLabels[value]}</option>)}</select></label>} />
    <details className="mb-6 rounded-xl border border-black/15 bg-white/40 p-4"><summary className="cursor-pointer font-semibold">+ Thêm {entryLabels[kind].toLowerCase()}</summary><div className="mt-4"><ResumeEntryForm key={kind} kind={kind} /></div></details>
    <div className="space-y-4">{entries.length === 0 && <p className="rounded-xl border border-dashed border-black/20 p-8 text-sm text-black/60">Chưa có nội dung phù hợp. Thêm bản nháp hoặc nhập dữ liệu hiện có từ Cài đặt.</p>}{entries.map((entry) => <section key={`${entry.id}-${entry.updatedAt}`} className="rounded-xl border border-black/15 bg-white/35 p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-semibold">{entry.title.vi}</h2><p className="mt-1 text-xs text-black/60">{entry.status === "PUBLISHED" ? "Công khai" : entry.status === "ARCHIVED" ? "Lưu trữ" : "Bản nháp"} · Thứ tự {entry.sortOrder}</p></div><ContentControls table="resume_entries" id={entry.id} updatedAt={entry.updatedAt} status={entry.status} /></div><details className="mt-4"><summary className="cursor-pointer text-sm underline underline-offset-4">Chỉnh sửa nội dung</summary><div className="mt-4"><ResumeEntryForm kind={entry.kind} entry={entry} /></div></details></section>)}</div>
    <Pagination page={page} total={count ?? 0} base="/admin/resume" params={{ kind, q, status }} /></div>;
}
