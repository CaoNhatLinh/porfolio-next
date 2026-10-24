"use client";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { void error; return <div className="site-shell grid min-h-screen place-items-center bg-[var(--ink)] px-6 text-center text-[var(--paper)]"><div><p className="mono text-xs uppercase tracking-[.16em] text-[var(--accent)]">Something interrupted the page</p><h1 className="display mt-5 text-6xl font-bold leading-[.8]">Try once more.</h1><button type="button" className="button-accent mt-8" onClick={() => reset()}>Reload</button></div></div>; }
