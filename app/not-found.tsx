import Link from "next/link";

export default function NotFound() {
  return <main className="site-shell-light grid min-h-[100dvh] place-items-center p-8 text-center"><div><p className="mono text-xs uppercase tracking-[.18em] opacity-55">404</p><h1 className="display mt-4 text-7xl font-bold">Not found</h1><p className="mt-5 opacity-65">This page is not part of the work yet.</p><Link href="/" className="button-accent mt-8">Back home</Link></div></main>;
}
