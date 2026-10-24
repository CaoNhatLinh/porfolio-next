import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownArticle({ source }: { source: string }) {
  return <div className="max-w-3xl text-[var(--ink)]">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      h2: ({ children }) => <h2 className="display mt-16 text-4xl font-bold leading-[.9] tracking-tight first:mt-0 md:text-6xl">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-12 text-xl font-semibold tracking-tight md:text-2xl">{children}</h3>,
      p: ({ children }) => <p className="mt-6 max-w-[68ch] text-lg leading-[1.7] text-black/72 first:mt-0">{children}</p>,
      ul: ({ children }) => <ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-[1.65] text-black/72">{children}</ul>,
      ol: ({ children }) => <ol className="mt-6 list-decimal space-y-3 pl-6 text-lg leading-[1.65] text-black/72">{children}</ol>,
      li: ({ children }) => <li className="pl-2">{children}</li>,
      strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
      pre: ({ children }) => <pre className="mt-8 overflow-x-auto rounded-[10px] bg-[var(--ink)] p-5 font-mono text-sm leading-relaxed text-white/80">{children}</pre>,
      blockquote: ({ children }) => <blockquote className="mt-8 border-l-2 border-[var(--accent-ink)] pl-5 text-lg italic leading-relaxed text-black/65">{children}</blockquote>,
      hr: () => <hr className="my-12 border-black/15" />,
    }}>{source}</ReactMarkdown>
  </div>;
}
