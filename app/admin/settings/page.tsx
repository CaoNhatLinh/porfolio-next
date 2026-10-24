import Link from "next/link";
import { cmsActor } from "../cms-access";
import { importSourceContentAction } from "./import-action";
import { ActionForm } from "../../components/admin/action-form";
import { AdminHeading, adminInputClass } from "../../components/admin/fields";

export const dynamic = "force-dynamic";
export default async function AdminSettingsPage() {
  const { user, database } = await cmsActor();
  const tables = ["site_profile", "projects", "articles", "resume_entries", "media_assets", "lab_items", "audit_logs"];
  const health = await Promise.all(tables.map(async (table) => { const { error } = await database.from(table).select("id", { head: true, count: "exact" }); return { table, ready: !error }; }));
  const { data: bucket, error: bucketError } = await database.storage.getBucket("portfolio-media");
  const environments = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ADMIN_EMAIL", "RESEND_API_KEY", "CONTACT_NOTIFICATION_EMAIL", "ANALYTICS_SALT", "CRON_SECRET"];
  return <div><AdminHeading title="Cài đặt & kiểm tra hệ thống" description="Kiểm tra kết nối, chuẩn bị nội dung và sao lưu. Khóa bí mật chỉ cấu hình ở .env.local hoặc Vercel; không hiển thị trong admin." />
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-black/15 bg-[var(--paper)] p-6"><h2 className="text-xl font-semibold">Kết nối & migration</h2><p className="mt-3 text-sm">Admin: {user.email}</p><ul className="mt-4 space-y-2 text-sm">{health.map((item) => <li key={item.table} className="flex justify-between gap-4"><code>{item.table}</code><span className={item.ready ? "text-green-800" : "text-red-700"}>{item.ready ? "Sẵn sàng" : "Thiếu bảng / lỗi truy vấn"}</span></li>)}<li className="flex justify-between"><span>Bucket portfolio-media</span><span>{!bucketError && bucket ? "Sẵn sàng" : "Chưa sẵn sàng"}</span></li></ul></section>
      <section className="rounded-xl border border-black/15 bg-[var(--paper)] p-6"><h2 className="text-xl font-semibold">Cấu hình môi trường</h2><ul className="mt-4 space-y-2 text-xs">{environments.map((key) => <li key={key} className="flex flex-wrap justify-between gap-2"><code>{key}</code><span>{process.env[key] ? "Đã cấu hình" : "Chưa cấu hình"}</span></li>)}</ul><p className="mt-4 text-xs leading-relaxed text-black/60">Email cần Resend và sender domain hợp lệ. Đăng nhập được kiểm tra lại ở mỗi thao tác; không có đăng ký admin công khai.</p></section>
      <section className="rounded-xl border border-black/15 bg-[var(--paper)] p-6"><h2 className="text-xl font-semibold">Nhập dữ liệu đang có</h2><p className="mt-3 text-sm leading-relaxed text-black/65">Thêm các dự án và hồ sơ từ source nếu còn thiếu. Không ghi đè bản ghi đã chỉnh. Nội dung mới là nháp, chưa xuất hiện công khai. Bạn có thể chạy lại sau lỗi mà không tạo bản trùng.</p><ActionForm action={importSourceContentAction} className="mt-5"><label className="text-sm">Nhập NHẬP để xác nhận<input name="confirmation" required pattern="NHẬP" className={adminInputClass} /></label><button type="submit" className="button-accent">Nhập nội dung còn thiếu</button></ActionForm></section>
      <section className="rounded-xl border border-black/15 bg-[var(--paper)] p-6"><h2 className="text-xl font-semibold">Sao lưu & hoạt động</h2><p className="mt-3 text-sm leading-relaxed text-black/65">Xuất nội dung thành JSON. File chứa dữ liệu biên tập và URL ảnh/CV, không chứa khóa bí mật. Đây không phải bản sao lưu các file Storage.</p><a href="/api/admin/export" className="button-accent mt-5">Tải bản sao nội dung JSON</a><Link href="/admin/audit" className="mt-4 block text-sm underline">Xem lịch sử thay đổi</Link><Link href="/admin/media?type=pdf" className="mt-4 block text-sm underline">Upload / thay CV PDF</Link></section>
    </div>
  </div>;
}
