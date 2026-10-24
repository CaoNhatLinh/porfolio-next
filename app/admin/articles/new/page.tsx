import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createArticleAction } from "../../actions";
import { ArticleEditorForm, type ArticleEditorValues } from "../../../components/admin/article-editor-form";
import { articleStarters, getArticleStarter } from "../../../features/content/article-starters";

export const dynamic = "force-dynamic";

const values: ArticleEditorValues = {
  slug: "",
  title: { vi: "", en: "" },
  topic: "Notes",
  readingTime: "5 min read",
  excerpt: { vi: "", en: "" },
  body: { vi: "", en: "" },
};

export default async function NewArticlePage({ searchParams }: { searchParams: Promise<{ starter?: string }> }) {
  const starter = getArticleStarter((await searchParams).starter);
  const editorValues = starter ? { ...starter, coverUrl: starter.cover.src } : values;
  return <div>
    <Link href="/admin/articles" className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-black/50 hover:text-black"><ArrowLeft size={15} /> Bài viết</Link>
    <h1 className="display mt-8 text-5xl font-bold leading-none md:text-7xl">Viết bài mới</h1>
    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65">Viết từ đầu hoặc mở một gợi ý bên dưới để chỉnh theo cách kể của bạn. Gợi ý chưa được lưu vào database. Bấm Tạo bản nháp để lưu; bài chỉ xuất hiện trên website khi bạn chọn Xuất bản.</p>
    <section aria-label="Gợi ý để bắt đầu" className="mt-8 max-w-5xl">
      <div className="flex items-center justify-between gap-4"><h2 className="font-semibold">Gợi ý để bắt đầu</h2><Link className="focus-ring text-sm underline underline-offset-4" href="/admin/articles/new">Trang trắng</Link></div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {articleStarters.map((item) => <Link key={item.slug} href={`/admin/articles/new?starter=${item.slug}`} aria-current={starter?.slug === item.slug ? "true" : undefined} className={`focus-ring rounded-xl border p-5 transition-colors hover:bg-black/5 ${starter?.slug === item.slug ? "border-orange-600 bg-orange-50" : "border-black/15"}`}>
          <span className="text-xs text-black/55">{item.topic} · Có sơ đồ và code</span>
          <h3 className="mt-3 font-semibold leading-snug">{item.title.vi}</h3>
        </Link>)}
      </div>
      <details className="mt-5 rounded-xl border border-black/15 p-5 text-sm leading-relaxed">
        <summary className="focus-ring cursor-pointer font-semibold">Ghi chú về giọng viết và cách chèn ảnh</summary>
        <p className="mt-3">Dùng “mình” trong blog. Kể tình huống cụ thể, giải thích vì sao chọn cách đó và chỗ nào còn hạn chế. Giữ các từ như API, state, frontend khi dễ hiểu hơn bản dịch. Có thể dùng “vd”, “ok” hoặc :D nếu hợp đoạn; đừng cố làm mọi câu đều vui.</p>
        <p className="mt-3">Ảnh có thể upload ngay trong ô nội dung. Viết alt text mô tả điều người đọc cần thấy, rồi thêm chú thích bên dưới. Code đặt trong khối có tên ngôn ngữ, chẳng hạn ts hoặc css; giải thích input, output và trường hợp lỗi, không chỉ dán code.</p>
        <p className="mt-3">Các ví dụ đã chuẩn bị là bài giải thích kỹ thuật, không phải lời khẳng định rằng tính năng đã được triển khai ở công ty hay chạy production. Chỉnh những chi tiết trải nghiệm cá nhân trước khi xuất bản.</p>
      </details>
    </section>
    <ArticleEditorForm key={starter?.slug ?? "blank"} values={editorValues} action={createArticleAction} isNew />
  </div>;
}
