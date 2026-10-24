import Image from "next/image";

export function BrandLogo({ dark = false, className = "", priority = false }: { dark?: boolean; className?: string; priority?: boolean }) {
  return <span className={`inline-flex shrink-0 items-center ${dark ? "rounded-lg bg-[var(--paper)] px-1" : ""} ${className}`}><Image src="/brand/kamling-logo.png" width={360} height={176} alt="Kamling" priority={priority} loading="eager" className="h-auto w-full object-contain" /></span>;
}
