"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { contentStatusSchema } from "../features/content/resume-entry";
import { ActionConflictError, ActionNotFoundError, ActionValidationError, runAction } from "../lib/errors/action-result";
import { cmsActor, recordCmsAudit, refreshPortfolio } from "./cms-access";

const tableSchema = z.enum(["articles", "projects", "resume_entries", "lab_items"]);
function identity(form: FormData) { return { table: tableSchema.parse(form.get("table")), id: z.string().uuid().parse(form.get("id")), version: z.string().datetime().parse(form.get("expectedUpdatedAt")) }; }

export async function changeContentStatusAction(form: FormData) {
  return runAction(async () => {
    const { table, id, version } = identity(form);
    const status = contentStatusSchema.parse(form.get("status"));
    const { user, database } = await cmsActor();
    const { data: current, error: readError } = await database.from(table).select("*").eq("id", id).eq("owner_id", user.id).single();
    if (readError || !current) throw new ActionNotFoundError();
    if (current.status === "ARCHIVED" && status === "PUBLISHED") throw new ActionValidationError("Khôi phục thành bản nháp trước khi xuất bản.");
    const publishedAt = table === "articles" && status === "PUBLISHED" ? { published_at: current.published_at || new Date().toISOString() } : {};
    const { data, error } = await database.from(table).update({ status, ...publishedAt, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("updated_at", version).select("id").maybeSingle();
    if (error) throw new Error("Unable to change content status.");
    if (!data) throw new ActionConflictError();
    await recordCmsAudit(status.toLowerCase(), table, id, user.id);
    refreshPortfolio(); revalidatePath(`/admin/${table === "resume_entries" ? "resume" : table === "lab_items" ? "lab" : table}`);
  });
}

export async function deleteArchivedContentAction(form: FormData) {
  return runAction(async () => {
    const { table, id, version } = identity(form);
    if (form.get("confirmation") !== "XÓA") throw new ActionValidationError("Nhập XÓA để xác nhận xóa vĩnh viễn.");
    const { user, database } = await cmsActor();
    const { data, error } = await database.from(table).delete().eq("id", id).eq("owner_id", user.id).eq("status", "ARCHIVED").eq("updated_at", version).select("id").maybeSingle();
    if (error) throw new Error("Unable to delete archived content.");
    if (!data) throw new ActionConflictError();
    await recordCmsAudit("delete", table, id, user.id);
    refreshPortfolio(); revalidatePath(`/admin/${table === "resume_entries" ? "resume" : table === "lab_items" ? "lab" : table}`);
  });
}
