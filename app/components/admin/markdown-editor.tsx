"use client";
import { useRef, useState } from "react";
import { MarkdownArticle } from "../site/markdown-article";
import { AssetField } from "./asset-field";
import { adminInputClass } from "./fields";

export function MarkdownEditor({ name, label, value = "" }: { name: string; label: string; value?: string }) {
  const [source, setSource] = useState(value);
  const [preview, setPreview] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  function insert(before: string, after = "") {
    const start = input.current?.selectionStart ?? source.length;
    const end = input.current?.selectionEnd ?? source.length;
    setSource(`${source.slice(0, start)}${before}${source.slice(start, end) || "Nội dung"}${after}${source.slice(end)}`);
    input.current?.focus(); input.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }
  const tools = [{ label: "Đậm", before: "**", after: "**" }, { label: "Nghiêng", before: "_", after: "_" }, { label: "Tiêu đề", before: "\n## " }, { label: "Danh sách", before: "\n- " }, { label: "Code", before: "\n```ts\n", after: "\n```\n" }, { label: "Liên kết", before: "[", after: "](https://example.com)" }];
  return <div className="min-w-0 space-y-3"><label htmlFor={name} className="text-sm font-semibold">{label}</label><div className="flex flex-wrap gap-2">{tools.map((tool) => <button key={tool.label} type="button" onClick={() => insert(tool.before, tool.after)} className="rounded border border-black/20 px-2 py-1 text-xs">{tool.label}</button>)}<button type="button" aria-pressed={preview} onClick={() => setPreview(!preview)} className="rounded bg-black px-3 py-1 text-xs text-white">{preview ? "Tiếp tục viết" : "Xem trước"}</button></div><textarea ref={input} id={name} name={name} required value={source} onChange={(event) => setSource(event.target.value)} rows={16} className={`${adminInputClass} font-mono text-sm ${preview ? "hidden" : ""}`} /><AssetField name={`${name}-image`} label="Ảnh muốn chèn (mô tả ảnh sửa trong Markdown)" onSelect={(url) => insert(`\n![`, `](${url})\n`)} />{preview && <div className="max-h-[600px] overflow-auto rounded-lg border border-black/15 bg-white p-5"><MarkdownArticle source={source} /></div>}<p className="text-xs text-black/60">Hỗ trợ Markdown, bảng, code và hình ảnh. Không thực thi HTML hoặc script.</p></div>;
}
