import Link from "next/link";
import { saveProfileAction } from "../actions";
import { cmsActor } from "../cms-access";
import { profile as initialProfile } from "../../features/content/data";
import { ActionForm } from "../../components/admin/action-form";
import { AdminField, AdminHeading } from "../../components/admin/fields";
import { AssetField } from "../../components/admin/asset-field";
import { LinksEditor } from "../../components/admin/structured-fields";

export const dynamic = "force-dynamic";
function localized(value: unknown, locale: "vi" | "en") { return typeof value === "object" && value !== null ? String((value as Record<string, unknown>)[locale] ?? "") : ""; }
export default async function AdminProfilePage() {
  const { user, database } = await cmsActor();
  const { data: profile, error } = await database.from("site_profile").select("*").eq("owner_id", user.id).maybeSingle();
  if (error) throw new Error("Unable to load profile.");
  const value = (field: string, locale: "vi" | "en", fallback: { vi: string; en: string } = { vi: "", en: "" }) => localized(profile?.[field] ?? fallback, locale);
  const seo = profile?.seo ?? initialProfile.seo ?? {};
  return <div><AdminHeading title="Hồ sơ cá nhân" description="Thông tin dùng ở trang chủ, About, CV và liên hệ. Kinh nghiệm và kỹ năng có mục quản lý riêng." />
    <ActionForm action={saveProfileAction} guard className="mt-6 max-w-5xl rounded-xl border border-black/15 bg-[var(--paper)] p-5 md:p-8">
      <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminField name="name" label="Họ tên" required value={profile?.name ?? initialProfile.name} />
        <AdminField name="email" label="Email liên hệ" type="email" required value={profile?.email ?? initialProfile.email} />
        {(["vi", "en"] as const).map((locale) => <div key={locale} className="space-y-4">
          <h3 className="font-semibold">{locale === "vi" ? "Tiếng Việt" : "English"}</h3>
          <AdminField name={locale === "vi" ? "titleVi" : "titleEn"} label="Chức danh" required value={value("title", locale, initialProfile.title)} />
          <AdminField name={locale === "vi" ? "introVi" : "introEn"} label="Giới thiệu ngắn" required multiline value={value("intro", locale, initialProfile.intro)} />
          <AdminField name={locale === "vi" ? "bioVi" : "bioEn"} label="Giới thiệu chi tiết" required multiline value={value("bio", locale, initialProfile.bio)} />
          <AdminField name={locale === "vi" ? "availabilityVi" : "availabilityEn"} label="Trạng thái nhận việc" required value={value("availability", locale, initialProfile.availability)} />
          <AdminField name={locale === "vi" ? "responseTimeVi" : "responseTimeEn"} label="Thời gian phản hồi" value={value("response_time", locale, initialProfile.responseTime)} />
        </div>)}
        <AdminField name="location" label="Địa điểm" value={profile?.location ?? initialProfile.location} />
        <AdminField name="engagementModes" label="Hình thức hợp tác (dấu phẩy)" value={(profile?.engagement_modes ?? initialProfile.engagementModes ?? []).join(", ")} />
        <AssetField name="imageUrl" label="Ảnh chân dung" value={profile?.image_url ?? initialProfile.image} />
      </div>
      <LinksEditor name="socialsJson" label="Mạng xã hội / GitHub" value={Array.isArray(profile?.socials) ? profile.socials : initialProfile.socials ?? []} />
      <h2 className="text-xl font-semibold">Thông tin tìm kiếm</h2>
      <div className="grid gap-5 md:grid-cols-2"><AdminField name="seoTitle" label="Tiêu đề SEO" value={seo.title ?? ""} /><AdminField name="seoDescription" label="Mô tả SEO" multiline value={seo.description ?? ""} /></div>
      <button type="submit" className="button-accent">Lưu hồ sơ</button>
    </ActionForm>
    <section className="mt-6 rounded-xl border border-black/15 bg-white/40 p-5"><h2 className="text-lg font-semibold">CV PDF</h2><p className="mt-2 text-sm text-black/65">Upload và chọn file CV trong thư viện tài liệu. Lưu hồ sơ không ghi đè CV đang chọn.</p><Link href="/admin/media?type=pdf" className="button-accent mt-4">Quản lý / upload CV PDF</Link></section>
  </div>;
}
