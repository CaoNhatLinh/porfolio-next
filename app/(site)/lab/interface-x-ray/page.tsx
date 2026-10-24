import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { InterfaceXRay } from "../../../components/site/interface-x-ray";
import { SiteFooter } from "../../../components/site/site-footer";
import { SiteHeader } from "../../../components/site/site-header";
import { getLocale } from "../../../features/content/data";

export const metadata = {
  title: "Interface X-Ray — Interactive study",
  description: "Inspect the systems, states, and accessibility beneath a product interface.",
};

export default async function InterfaceXRayPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = getLocale((await searchParams).lang);
  const copy = locale === "vi";

  return (
    <div className="site-shell-light">
      <SiteHeader locale={locale} />
      <main className="page-width pb-24 pt-10 md:pb-32 md:pt-16">
        <Link
          href={`/about?lang=${locale}`}
          className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.12em] text-black/45 transition-colors hover:text-black"
        >
          <ArrowLeft size={15} />
          {copy ? "Quay lại Lab" : "Back to Lab"}
        </Link>

        <div className="mt-10 border-t border-black/15 pt-8 md:mt-14">
          <InterfaceXRay locale={locale} />
        </div>

        <div className="mt-8 grid gap-4 border-y border-black/15 py-5 text-sm text-black/50 md:grid-cols-3">
          <p>{copy ? "01 — Rê chuột hoặc kéo thấu kính." : "01 — Hover or drag the lens."}</p>
          <p>{copy ? "02 — Chuyển lớp để đổi góc nhìn." : "02 — Switch layers to change the view."}</p>
          <p>{copy ? "03 — Phím mũi tên cũng di chuyển được." : "03 — Arrow keys move it too."}</p>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
