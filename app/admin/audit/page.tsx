import { cmsActor } from "../cms-access";
import { listParams } from "../list-query";
import { AdminHeading } from "../../components/admin/fields";
import { Pagination } from "../../components/admin/list-toolbar";
export const dynamic = "force-dynamic";
export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = listParams(await searchParams); const { user, database } = await cmsActor();
  const { data, count, error } = await database.from("audit_logs").select("id, action, entity_type, entity_id, created_at", { count: "exact" }).eq("actor_id", user.id).order("created_at", { ascending: false }).order("id", { ascending: false }).range((page - 1) * 20, page * 20 - 1);
  if (error) throw new Error("Unable to load audit history.");
  return <div><AdminHeading title="Lịch sử quản trị" description="Theo dõi thay đổi nội dung, xuất bản, lưu trữ và lựa chọn CV. Nhật ký là thông tin đối chiếu, không phải bản sao lưu nội dung." /><div className="mt-6 divide-y rounded-xl border border-black/15 bg-[var(--paper)]">{!data?.length && <p className="p-6 text-sm">Chưa có hoạt động.</p>}{data?.map((entry) => <article key={entry.id} className="grid gap-2 p-5 md:grid-cols-[12rem_1fr]"><p className="text-xs text-black/60">{new Date(entry.created_at).toLocaleString("vi-VN")}</p><div><h2 className="text-sm font-semibold">{entry.action} · {entry.entity_type}</h2><p className="mt-1 break-all font-mono text-xs text-black/60">{entry.entity_id}</p></div></article>)}</div><Pagination page={page} total={count ?? 0} base="/admin/audit" params={{}} /></div>;
}
