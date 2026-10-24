import { SiteHeader } from "../../components/site/site-header";
import { SiteFooter } from "../../components/site/site-footer";
import { PlayroomArcade } from "../../components/site/playroom-arcade";
import { OrangeClue } from "../../components/site/orange-clue";
import { GaimSprite } from "../../components/site/gaim-sprite";
import { getLocale } from "../../features/content/data";
import { Caveat_Brush, Nunito } from "next/font/google";

const brush = Caveat_Brush({ weight: "400", subsets: ["latin"], variable: "--font-play-brush", display: "swap" });
const playBody = Nunito({ subsets: ["latin", "vietnamese"], variable: "--font-play-body", display: "swap" });

export const metadata = { title: "Playroom · Góc riêng" };

export default async function PlayroomPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = getLocale((await searchParams).lang);
  const vi = locale === "vi";

  return (
    <div className="site-shell-light">
      <SiteHeader locale={locale} />
      <main>
        <header className="page-width py-12 md:py-20">
          <p className="mono text-xs text-[var(--accent-ink)]">
            {vi ? "Góc riêng / ngoài giờ code" : "Off the clock"}
            <OrangeClue folio="playroom" locale={locale} />
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
            {vi ? "Một chút vui thôi." : "Just for fun."}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-black/65">
            {vi
              ? "Mình thích Kamen Rider, pixel art và mấy thứ nhỏ nhỏ có thể nghịch. Để ở đây cho đỡ chen vào phần công việc :D"
              : "I like Kamen Rider, pixel art, and little things you can play with. This is their corner, separate from the work."}
          </p>
        </header>

        <section className="page-width grid items-center gap-10 border-y border-black/15 py-12 md:grid-cols-2">
          <div>
            <p className="mono text-xs text-black/50">01 / Kamen Rider</p>
            <h2 className="mt-4 text-3xl font-semibold">Gaim · Orange Arms</h2>
            <p className="mt-4 max-w-md leading-relaxed text-black/65">
              {vi
                ? "Một chiếc GIF pixel của Gaim. Mình giữ lại vì thích nhân vật này — và trái cam cũng hợp với Kamling."
                : "A pixel GIF of Gaim. A favorite character, and the orange fits Kamling too."}
            </p>
            <p className="mt-5 text-xs text-black/50">
              {vi ? "Góc sưu tầm cá nhân dành cho fan Kamen Rider." : "A personal corner for a Kamen Rider fan."}
            </p>
          </div>
          <GaimSprite locale={locale} />
        </section>

        <div className={`page-width ${brush.variable} ${playBody.variable}`}><PlayroomArcade locale={locale} /></div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
