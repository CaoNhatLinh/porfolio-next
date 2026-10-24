"use client";

import { ArrowDown, Printer } from "@phosphor-icons/react";
import { useEffect } from "react";
import { trackPortfolioEvent } from "./analytics-tracker";

export function ResumeActions({ resumeUrl, locale }: { resumeUrl?: string; locale: "vi" | "en" }) {
  const copy = locale === "vi";
  useEffect(() => { trackPortfolioEvent("resume_view"); }, []);
  return <div className="flex flex-wrap gap-3 print:hidden"><button type="button" className="button-accent" onClick={() => { trackPortfolioEvent("resume_print"); window.print(); }}><Printer size={17} />{copy ? "In / lưu PDF" : "Print / save PDF"}</button>{resumeUrl ? <a className="button-quiet" href={resumeUrl} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent("resume_download")}><ArrowDown size={17} />{copy ? "Tải CV" : "Download CV"}</a> : <span className="mono self-center text-[10px] uppercase tracking-[.12em] text-black/45">{copy ? "PDF sẽ được thêm sau" : "PDF link coming soon"}</span>}</div>;
}
