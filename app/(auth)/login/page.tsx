import Link from "next/link";
import { LockKey } from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "../../components/auth/login-form";
import { BrandLogo } from "../../components/brand/brand-logo";

export const metadata = { title: "Admin login" };

export default function LoginPage() {
  return <main className="site-shell-light grid min-h-screen place-items-center px-5 py-16"><div className="w-full max-w-md"><Link href="/" className="focus-ring inline-flex"><BrandLogo priority className="h-16 w-[174px]" /></Link><div className="mt-10 rounded-[16px] border border-black/15 bg-white/35 p-7 md:p-10"><p className="mono flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-black/50"><LockKey size={15} /> Private space</p><h1 className="display mt-5 text-6xl font-bold leading-[.82]">Admin</h1><p className="mt-6 text-sm leading-relaxed text-black/60">Sign in with the single Supabase account configured for this portfolio.</p><div className="mt-9"><LoginForm /></div></div><p className="mono mt-7 text-center text-[10px] uppercase tracking-[.12em] text-black/40">No public registration</p></div></main>;
}
