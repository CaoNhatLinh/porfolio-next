import "server-only";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "../lib/auth/admin";
import { createSupabaseAdminClient } from "../lib/supabase/admin";

export async function cmsActor() {
  const user = await getAdminUser();
  if (!user) throw new Error("Unauthorized");
  return { user, database: createSupabaseAdminClient() };
}

export function refreshPortfolio() {
  for (const path of ["/", "/about", "/resume", "/hire", "/contact", "/admin", "/admin/resume", "/admin/media", "/admin/profile", "/sitemap.xml"]) revalidatePath(path);
  revalidatePath("/work", "layout");
  revalidatePath("/journal", "layout");
}

export async function recordCmsAudit(action: string, entity: string, id: string, actorId: string) {
  const { error } = await createSupabaseAdminClient().from("audit_logs").insert({ actor_id: actorId, action, entity_type: entity, entity_id: id });
  if (error) console.error("cms_audit_failed", { action, entity });
}
