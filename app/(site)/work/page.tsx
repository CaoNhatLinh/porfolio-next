import { SiteFooter } from "../../../app/components/site/site-footer";
import { SiteHeader } from "../../../app/components/site/site-header";
import { WorkBrowser } from "../../../app/components/site/work-browser";
import { getLocale } from "../../../app/features/content/data";
import { getPublicProjects } from "../../../app/features/content/repository";

export const metadata = { title: "Work" };

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; category?: string; view?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocale(params.lang);
  const copy = locale === "vi";
  const projects = await getPublicProjects();

  return (
    <div className="site-shell-light">
      <SiteHeader locale={locale} />
      <main>
        <section className="page-width pb-16 pt-12 md:pb-24 md:pt-24">
          <div className="editorial-rule grid gap-10 pt-6 md:grid-cols-[1.3fr_.7fr] md:items-end">
            <div>
              <p className="editorial-kicker text-black/50">
                {copy ? "Dự án / chọn lọc" : "Work / selected"}
                <OrangeClue folio="work" locale={locale} />
              </p>
              <h1 className="display work-hero-title mt-8 max-w-5xl font-bold">
                {copy ? "Dự án" : "Work"}
              </h1>
            </div>
            <p className="max-w-sm pb-2 text-lg leading-relaxed text-black/65">
              {copy
                ? "Các dự án web, mobile và backend tôi đã làm. Mỗi dự án có phần mô tả công việc, lựa chọn kỹ thuật và mã nguồn để xem thêm."
                : "Web, mobile, and backend projects I've worked on. Each includes my implementation, technical choices, and links to the source."}
            </p>
          </div>
          <WorkBrowser
            locale={locale}
            projects={projects}
            initialCategory={params.category}
            initialView={params.view}
          />
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
import { OrangeClue } from "../../components/site/orange-clue";
