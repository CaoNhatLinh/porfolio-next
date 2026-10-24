import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "../env/public";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getPublicEnv();
  return createBrowserClient(url, anonKey);
}
