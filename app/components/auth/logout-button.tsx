"use client";

import { SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    try { await createSupabaseBrowserClient().auth.signOut(); } finally { router.push("/login"); }
  }
  return <button type="button" onClick={logout} className="focus-ring mt-3 inline-flex items-center gap-2 text-xs text-black/55 hover:text-black"><SignOut size={15} /> Sign out</button>;
}
