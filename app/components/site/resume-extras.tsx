import type { ResumeEntry } from "../../features/content/resume-entry";
import { formatEntryPeriod } from "../../features/content/resume-entry";
import { localized, type Locale } from "../../features/content/types";

export function ResumeExtras({ entries, title, locale }: { entries: ResumeEntry[]; title: string; locale: Locale }) {
  if (!entries.length) return null;
  return <section className="border-t border-black/15 pt-6"><h2 className="text-3xl font-semibold">{title}</h2><div className="divide-y divide-black/15">{entries.map((entry) => <article key={entry.id} className="grid gap-4 py-6 sm:grid-cols-[7rem_1fr]"><p className="mono text-xs text-black/60">{localized(formatEntryPeriod(entry), locale)}</p><div><h3 className="text-xl font-medium">{localized(entry.title, locale)}</h3><p className="mt-2 text-sm text-black/60">{localized(entry.subtitle, locale)}</p><p className="mt-3 whitespace-pre-line leading-relaxed text-black/70">{localized(entry.body, locale)}</p>{entry.evidenceUrl && <a href={entry.evidenceUrl} target="_blank" rel="noreferrer" className="accent-link mt-4 inline-block">{locale === "vi" ? "Xem thông tin xác minh ↗" : "View credential ↗"}</a>}</div></article>)}</div></section>;
}
