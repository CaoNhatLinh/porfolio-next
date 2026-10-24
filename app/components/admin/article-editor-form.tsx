"use client";

import { Check } from "@phosphor-icons/react";
import type { Article } from "../../features/content/types";
import type { ActionResult } from "../../lib/errors/action-result";
import { ActionForm } from "./action-form";
import { AssetField } from "./asset-field";
import { MarkdownEditor } from "./markdown-editor";

type Action = (formData: FormData) => Promise<ActionResult<void>>;

export type ArticleEditorValues = Partial<Pick<Article, "slug" | "title" | "topic" | "readingTime" | "excerpt" | "body">> & {
  id?: string;
  updatedAt?: string;
  coverUrl?: string;
};

export function ArticleEditorForm({ values, action, isNew = false }: { values: ArticleEditorValues; action: Action; isNew?: boolean }) {
  const localized = (value: { vi: string; en: string } | undefined, locale: "vi" | "en") => value?.[locale] ?? "";

  return <ActionForm action={action} guard successHref={isNew ? "/admin/articles" : undefined} className="mt-8 max-w-5xl space-y-8 rounded-[14px] border border-black/10 bg-[var(--paper)] p-6 md:p-10">
    <div className="grid gap-7 md:grid-cols-[1.2fr_.8fr]">
      <Field name="slug" label="Slug" value={values.slug ?? ""} readOnly={!isNew} />
      <Field name="topic" label="Chủ đề" value={values.topic ?? "Notes"} />
      <AssetField name="coverUrl" label="Ảnh bìa" value={values.coverUrl ?? ""} />
    </div>
    <div className="grid gap-7 md:grid-cols-2">
      <TextField name="titleVi" label="Tiêu đề · Tiếng Việt" value={localized(values.title, "vi")} />
      <TextField name="titleEn" label="Tiêu đề · English" value={localized(values.title, "en")} />
      <Field name="readingTime" label="Thời gian đọc ước tính" value={values.readingTime ?? "5 min"} />
      <div />
      <TextField name="excerptVi" label="Giới thiệu ngắn · Tiếng Việt" value={localized(values.excerpt, "vi")} />
      <TextField name="excerptEn" label="Giới thiệu ngắn · English" value={localized(values.excerpt, "en")} />
    </div>
    <div className="grid gap-7 md:grid-cols-2">
      <MarkdownEditor name="bodyVi" label="Nội dung · Tiếng Việt" value={localized(values.body, "vi")} />
      <MarkdownEditor name="bodyEn" label="Nội dung · English" value={localized(values.body, "en")} />
    </div>
    {values.id && <><input type="hidden" name="id" value={values.id} /><input type="hidden" name="expectedUpdatedAt" value={values.updatedAt} /></>}
    <button className="button-accent" type="submit"><Check size={18} /> {isNew ? "Tạo bản nháp" : "Lưu bài viết"}</button>
  </ActionForm>;
}

function Field({ name, label, value, type = "text", readOnly = false, required = true }: { name: string; label: string; value: string; type?: string; readOnly?: boolean; required?: boolean }) {
  return <label className="block"><span className="mono text-[10px] uppercase tracking-[.14em] text-black/45">{label}</span><input required={required} name={name} type={type} readOnly={readOnly} defaultValue={value} className="form-input !border-black/20 !text-[var(--ink)] read-only:cursor-not-allowed read-only:bg-black/5" /></label>;
}

function TextField({ name, label, value, tall = false }: { name: string; label: string; value: string; tall?: boolean }) {
  return <label className="block"><span className="mono text-[10px] uppercase tracking-[.14em] text-black/45">{label}</span><textarea required name={name} defaultValue={value} className={`form-input resize-y !border-black/20 !text-[var(--ink)] ${tall ? "min-h-80 font-mono text-sm" : "min-h-24"}`} /></label>;
}
