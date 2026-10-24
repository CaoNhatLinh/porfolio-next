import Link from "next/link";
import { adminInputClass } from "./fields";
export function ListToolbar({ q = "", status = "", extra }: { q?: string; status?: string; extra?: React.ReactNode }) {
  return <form method="get" className="my-6 flex flex-wrap items-end gap-3"><label className="min-w-48 flex-1 text-sm">Tìm kiếm<input name="q" type="search" defaultValue={q} className={adminInputClass} placeholder="Nhập tên hoặc từ khóa" /></label><label className="text-sm">Trạng thái<select name="status" defaultValue={status} className={adminInputClass}><option value="">Tất cả</option><option value="PUBLISHED">Công khai</option><option value="DRAFT">Bản nháp / ẩn</option><option value="ARCHIVED">Lưu trữ</option></select></label>{extra}<button className="button-accent" type="submit">Lọc</button></form>;
}
export function Pagination({ page, total, base, params }: { page: number; total: number; base: string; params: Record<string, string> }) {
  const pages = Math.max(1, Math.ceil(total / 20));
  const href = (value: number) => `${base}?${new URLSearchParams({ ...params, page: String(value) })}`;
  return <nav aria-label="Phân trang" className="mt-6 flex items-center justify-between gap-3 text-sm"><span>{total} bản ghi · Trang {page}/{pages}</span><div className="flex gap-3">{page > 1 && <Link className="underline" href={href(page - 1)}>Trang trước</Link>}{page < pages && <Link className="underline" href={href(page + 1)}>Trang sau</Link>}</div></nav>;
}
