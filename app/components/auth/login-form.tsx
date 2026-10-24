"use client";

import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      router.push("/admin");
    } catch {
      setError("Unable to sign in with those details.");
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="space-y-6"><label className="block"><span className="mono text-[10px] uppercase tracking-[.14em] text-black/50">Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="form-input !border-black/20 !text-[var(--ink)]" autoComplete="email" /></label><label className="block"><span className="mono text-[10px] uppercase tracking-[.14em] text-black/50">Password</span><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="form-input !border-black/20 !text-[var(--ink)]" autoComplete="current-password" /></label>{error && <p className="text-sm text-red-700" role="alert">{error}</p>}<button className="button-accent" type="submit" disabled={loading}>{loading ? <CircleNotch size={18} className="animate-spin" /> : <ArrowRight size={18} />} {loading ? "Signing in" : "Enter admin"}</button></form>;
}
