import "server-only";
import { redirect } from "next/navigation";
import { getServerEnv } from "../env/server";
import { createSupabaseServerClient } from "../supabase/server";

export async function getAdminUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const adminEmail = getServerEnv().ADMIN_EMAIL;
    if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/login?next=/admin");
  return user;
}
