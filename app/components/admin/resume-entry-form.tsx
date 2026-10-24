"use client";
import { useState } from "react";
import type { EntryKind, ResumeEntry } from "../../features/content/resume-entry";
import { entryLabels } from "../../features/content/resume-entry";
import { saveResumeEntryAction } from "../../admin/resume/actions";
import { ActionForm } from "./action-form";
import { AdminField } from "./fields";
import { AssetField } from "./asset-field";

export function ResumeEntryForm({ kind, entry }: { kind: EntryKind; entry?: ResumeEntry }) {
  const [current, setCurrent] = useState(entry?.current ?? false);
  return <ActionForm action={saveResumeEntryAction} guard className="rounded-xl border border-black/15 bg-[var(--paper)] p-5 md:p-7">
    <h2 className="text-lg font-semibold">{entry ? "Chỉnh sửa" : "Thêm"} {entryLabels[kind].toLowerCase()}</h2>
    <input type="hidden" name="kind" value={kind} />
    {entry && <><input type="hidden" name="id" value={entry.id} /><input type="hidden" name="expectedUpdatedAt" value={entry.updatedAt} /></>}
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField name="titleVi" label={kind === "SKILL" ? "Nhóm kỹ năng · Tiếng Việt" : "Chức danh / tên · Tiếng Việt"} value={entry?.title.vi} required />
      <AdminField name="titleEn" label="Tên · English" value={entry?.title.en} required />
      <AdminField name="subtitleVi" label="Công ty / đơn vị / mô tả ngắn · Tiếng Việt" value={entry?.subtitle.vi} />
      <AdminField name="subtitleEn" label="Company / institution / subtitle · English" value={entry?.subtitle.en} />
      <AdminField name="bodyVi" label="Mô tả, công việc và kết quả · Tiếng Việt" value={entry?.body.vi} multiline />
      <AdminField name="bodyEn" label="Description and contributions · English" value={entry?.body.en} multiline />
      <AdminField name="startDate" label="Tháng bắt đầu / cấp chứng chỉ" type="month" value={entry?.startDate} />
      {!current && <AdminField name="endDate" label="Tháng kết thúc / hết hạn" type="month" value={entry?.endDate} />}
    </div>
    {current && <input type="hidden" name="endDate" value="" />}
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="current" value="true" checked={current} onChange={(event) => setCurrent(event.target.checked)} className="h-4 w-4 accent-orange-600" />Đang làm / đang theo học</label>
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField name="tools" label="Công nghệ / kỹ năng (ngăn cách bằng dấu phẩy)" value={entry?.tools.join(", ")} />
      <AssetField name="logoUrl" label="Logo công ty / biểu tượng" value={entry?.logoUrl} />
      <AdminField name="evidenceUrl" label="Website công ty / chứng chỉ / liên kết xác minh" value={entry?.evidenceUrl} />
      <AdminField name="projectSlug" label="Slug dự án liên quan (không bắt buộc)" value={entry?.projectSlug} />
      <AdminField name="sortOrder" label="Thứ tự (số nhỏ xuất hiện trước)" type="number" value={entry?.sortOrder ?? 0} />
    </div>
    <button className="button-accent" type="submit">{entry ? "Lưu thay đổi" : "Tạo bản nháp"}</button>
  </ActionForm>;
}
