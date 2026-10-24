"use client";
import type { Project } from "../../features/content/types";
import type { ActionResult } from "../../lib/errors/action-result";
import { ActionForm } from "./action-form";
import { AdminField, adminInputClass } from "./fields";
import { AssetField } from "./asset-field";
import { LinksEditor, GalleryEditor, SectionsEditor } from "./structured-fields";

type Action = (form: FormData) => Promise<ActionResult<void>>;
export type ProjectEditorValues = Partial<Pick<Project, "slug" | "title" | "category" | "year" | "duration" | "summary" | "role" | "teamContext" | "stack" | "image" | "imageFit" | "links" | "proofLinks" | "gallery" | "outcome" | "sections" | "isFeatured">> & { id?: string; updatedAt?: string; featuredOrder?: number; sortOrder?: number };

export function ProjectEditorForm({ values, action, isNew = false }: { values: ProjectEditorValues; action: Action; isNew?: boolean }) {
  return <ActionForm action={action} guard successHref={isNew ? "/admin/projects" : undefined} className="mt-8 max-w-5xl rounded-xl border border-black/15 bg-[var(--paper)] p-5 md:p-8">
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField name="title" label="Tên dự án" value={values.title} required />
      <AdminField name="slug" label="Slug · đường dẫn dự án"><input name="slug" required readOnly={!isNew} defaultValue={values.slug} className={adminInputClass} /></AdminField>
      <AdminField name="year" label="Năm" value={values.year} required />
      <AdminField name="duration" label="Thời gian thực hiện" value={values.duration} />
      <AdminField name="category" label="Loại dự án"><select name="category" defaultValue={values.category ?? "Web application"} className={adminInputClass}><option value="Web application">Ứng dụng web</option><option value="Mobile application">Ứng dụng mobile</option><option value="Backend system">Hệ thống backend</option><option value="Experiment">Thử nghiệm</option></select></AdminField>
      <AssetField name="imageUrl" label="Ảnh bìa dự án" value={values.image} />
      <AdminField name="imageFit" label="Cách hiển thị ảnh"><select name="imageFit" defaultValue={values.imageFit ?? "cover"} className={adminInputClass}><option value="cover">Lấp đầy khung (có thể cắt ảnh)</option><option value="contain">Hiển thị toàn bộ ảnh</option></select></AdminField>
    </div>
    <div className="grid gap-5 md:grid-cols-2">{(["vi", "en"] as const).map((locale) => <div key={locale} className="space-y-4">
      <h2 className="text-lg font-semibold">{locale === "vi" ? "Tiếng Việt" : "English"}</h2>
      <AdminField name={locale === "vi" ? "summaryVi" : "summaryEn"} label="Giới thiệu ngắn" multiline required value={values.summary?.[locale]} />
      <AdminField name={locale === "vi" ? "roleVi" : "roleEn"} label="Vai trò / phần bạn thực hiện" multiline required value={values.role?.[locale]} />
      <AdminField name={locale === "vi" ? "teamContextVi" : "teamContextEn"} label="Bối cảnh / đội ngũ" multiline value={values.teamContext?.[locale]} />
      <AdminField name={locale === "vi" ? "outcomeVi" : "outcomeEn"} label="Kết quả (chỉ ghi điều có thể chứng minh)" multiline required value={values.outcome?.[locale]} />
    </div>)}</div>
    <AdminField name="stack" label="Công nghệ, ngăn cách bằng dấu phẩy" value={values.stack?.join(", ")} required />
    <div className="grid gap-5 md:grid-cols-3"><AdminField name="featuredOrder" label="Thứ tự nổi bật" type="number" value={values.featuredOrder ?? 0} /><AdminField name="sortOrder" label="Thứ tự danh sách" type="number" value={values.sortOrder ?? 0} /><label className="flex items-center gap-3 text-sm"><input type="checkbox" name="isFeatured" value="true" defaultChecked={values.isFeatured} />Dự án nổi bật</label></div>
    <LinksEditor name="linksJson" label="Liên kết demo / GitHub" value={values.links} />
    <LinksEditor name="proofLinksJson" label="Liên kết tham khảo / bằng chứng" value={values.proofLinks} />
    <GalleryEditor value={values.gallery} /><SectionsEditor value={values.sections} />
    {values.id && <><input type="hidden" name="id" value={values.id} /><input type="hidden" name="expectedUpdatedAt" value={values.updatedAt} /></>}
    <button className="button-accent" type="submit">{isNew ? "Tạo dự án nháp" : "Lưu dự án"}</button>
  </ActionForm>;
}
