"use server";
import { z } from "zod";
import { cmsActor, recordCmsAudit, refreshPortfolio } from "../cms-access";
import { ActionNotFoundError, ActionValidationError, runAction } from "../../lib/errors/action-result";

export async function selectResumeAssetAction(form: FormData) {
  return runAction(async () => {
    const { user, database } = await cmsActor();
    const id = z.string().uuid().parse(form.get("id"));
    const { data: asset, error } = await database.from("media_assets").select("id, url, mime_type").eq("id", id).eq("owner_id", user.id).single();
    if (error || !asset) throw new ActionNotFoundError();
    if (asset.mime_type !== "application/pdf") throw new ActionValidationError("CV phải là file PDF đã tải lên.");
    const { data, error: saveError } = await database.from("site_profile").update({ resume_asset_id: asset.id, resume_url: asset.url, resume_updated_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString() }).eq("owner_id", user.id).select("id").maybeSingle();
    if (saveError) throw new Error("Unable to select resume.");
    if (!data) throw new ActionValidationError("Lưu thông tin ở trang Hồ sơ trước khi chọn CV.");
    await recordCmsAudit("select_cv", "media_asset", id, user.id); refreshPortfolio();
  });
}

export async function clearResumeAssetAction() {
  return runAction(async () => {
    const { user, database } = await cmsActor();
    const { data, error } = await database.from("site_profile").update({ resume_asset_id: null, resume_url: null, resume_updated_at: null, updated_at: new Date().toISOString() }).eq("owner_id", user.id).select("id").maybeSingle();
    if (error || !data) throw new Error("Unable to clear CV.");
    await recordCmsAudit("clear_cv", "site_profile", data.id, user.id); refreshPortfolio();
  });
}

export async function saveMediaAltAction(form: FormData) {
  return runAction(async () => {
    const { user, database } = await cmsActor(); const id = z.string().uuid().parse(form.get("id"));
    const alt = z.string().trim().max(240).parse(form.get("altText"));
    const { data, error } = await database.from("media_assets").update({ alt_text: alt }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error || !data) throw new Error("Unable to update media."); refreshPortfolio();
  });
}

export async function deleteMediaAssetAction(form: FormData) {
  return runAction(async () => {
    const { user, database } = await cmsActor(); const id = z.string().uuid().parse(form.get("id"));
    if (form.get("confirmation") !== "XÓA") throw new ActionValidationError("Nhập XÓA để xác nhận.");
    const { data: asset, error } = await database.from("media_assets").select("storage_key, url").eq("id", id).eq("owner_id", user.id).single();
    if (error || !asset) throw new ActionNotFoundError();
    const { data: references, error: referenceError } = await database.rpc("media_reference_count", { asset_url: asset.url, actor_id: user.id });
    if (referenceError) throw new Error("Unable to check media references.");
    if (Number(references) > 0) throw new ActionValidationError("File đang được dùng trong nội dung hoặc CV. Gỡ liên kết trước khi xóa.");
    const { error: storageError } = await database.storage.from("portfolio-media").remove([asset.storage_key]);
    if (storageError) throw new Error("Unable to remove storage file.");
    const { error: deleteError } = await database.from("media_assets").delete().eq("id", id).eq("owner_id", user.id);
    if (deleteError) throw new Error("Unable to remove media metadata.");
    await recordCmsAudit("delete", "media_asset", id, user.id); refreshPortfolio();
  });
}
