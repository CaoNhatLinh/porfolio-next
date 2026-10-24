"use client";
import { useState } from "react";
import { changeContentStatusAction, deleteArchivedContentAction } from "../../admin/content-actions";
import { ActionForm } from "./action-form";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

type ContentIdentity = { table: "articles" | "projects" | "resume_entries" | "lab_items"; id: string; updatedAt: string; status: string };
function HiddenIdentity({ item }: { item: ContentIdentity }) { return <><input type="hidden" name="table" value={item.table} /><input type="hidden" name="id" value={item.id} /><input type="hidden" name="expectedUpdatedAt" value={item.updatedAt} /></>; }

export function ContentControls(item: ContentIdentity) {
  const archived = item.status === "ARCHIVED";
  return <div className="flex flex-wrap items-start gap-2">
    <ActionForm action={changeContentStatusAction}><HiddenIdentity item={item} /><input type="hidden" name="status" value={archived ? "DRAFT" : item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} /><Button type="submit" variant="outline">{archived ? "Khôi phục nháp" : item.status === "PUBLISHED" ? "Ẩn" : "Xuất bản"}</Button></ActionForm>
    {!archived && <ConfirmAction item={item} />}
    {archived && <ConfirmAction item={item} permanent />}
  </div>;
}

function ConfirmAction({ item, permanent = false }: { item: ContentIdentity; permanent?: boolean }) {
  const [open, setOpen] = useState(false);
  return <AlertDialog open={open} onOpenChange={setOpen}><AlertDialogTrigger asChild><Button variant="danger">{permanent ? "Xóa vĩnh viễn" : "Lưu trữ"}</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogTitle>{permanent ? "Xóa vĩnh viễn nội dung này?" : "Lưu trữ nội dung này?"}</AlertDialogTitle><AlertDialogDescription>{permanent ? "Không thể khôi phục. Ảnh trong thư viện không bị xóa. Nhập XÓA để tiếp tục." : "Nội dung sẽ rời website công khai. Bạn vẫn có thể khôi phục từ danh sách quản trị."}</AlertDialogDescription><ActionForm action={async (form) => { const result = await (permanent ? deleteArchivedContentAction : changeContentStatusAction)(form); if (result.ok) setOpen(false); return result; }}><HiddenIdentity item={item} /><input type="hidden" name="status" value="ARCHIVED" />{permanent && <label className="mt-4 block text-sm">Xác nhận<input name="confirmation" required pattern="XÓA" autoComplete="off" className="form-input !text-black" /></label>}<AlertDialogFooter className="mt-5"><AlertDialogCancel>Hủy</AlertDialogCancel><Button type="submit" variant="danger">{permanent ? "Xóa vĩnh viễn" : "Lưu trữ"}</Button></AlertDialogFooter></ActionForm></AlertDialogContent></AlertDialog>;
}
