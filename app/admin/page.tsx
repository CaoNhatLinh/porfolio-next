import Link from "next/link";
import {
  ArrowUpRight,
  ChartLineUp,
  FileText,
  FolderOpen,
  PaperPlaneTilt,
  PencilSimple,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { createSupabaseAdminClient } from "../lib/supabase/admin";

export const dynamic = "force-dynamic";

async function count(table: string, status?: string) {
  try {
    let query = createSupabaseAdminClient()
      .from(table)
      .select("id", { count: "exact", head: true });
    if (status) query = query.eq("status", status);
    const result = await query;
    return result.count ?? 0;
  } catch {
    return null;
  }
}

export default async function AdminOverview() {
  const [
    projects,
    articles,
    messages,
    events,
    draftProjects,
    draftArticles,
    newMessages,
  ] = await Promise.all([
    count("projects"),
    count("articles"),
    count("contact_messages"),
    count("analytics_events"),
    count("projects", "DRAFT"),
    count("articles", "DRAFT"),
    count("contact_messages", "NEW"),
  ]);
  const needsAttention = [draftProjects, draftArticles, newMessages].filter(
    (value) => (value ?? 0) > 0,
  ).length;
  const cards = [
    {
      label: "Dự án",
      value: projects,
      href: "/admin/projects",
      icon: FolderOpen,
    },
    {
      label: "Bài viết",
      value: articles,
      href: "/admin/articles",
      icon: FileText,
    },
    {
      label: "Tin nhắn",
      value: messages,
      href: "/admin/messages",
      icon: PaperPlaneTilt,
    },
    {
      label: "Sự kiện",
      value: events,
      href: "/admin/analytics",
      icon: ChartLineUp,
    },
  ];

  return (
    <div>
      <header className="flex flex-col justify-between gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end">
        <div>
          <p className="mono text-xs uppercase tracking-[.15em] text-black/45">
            Không gian quản trị
          </p>
          <h1 className="display mt-3 text-6xl font-bold leading-[.8] md:text-8xl">
            Tổng quan
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/55">
          Điều chỉnh nội dung, theo dõi tín hiệu và giữ câu chuyện portfolio
          luôn đúng trọng tâm.
        </p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-[14px] border border-black/10 bg-[var(--paper)] p-6 transition-[transform,border-color] hover:-translate-y-1 hover:border-black/25"
          >
            <Icon size={22} className="text-[var(--accent-ink)]" />
            <p className="mono mt-12 text-[10px] uppercase tracking-[.14em] text-black/45">
              {label}
            </p>
            <div className="mt-2 flex items-end justify-between">
              <span className="display text-5xl font-bold">
                {value === null ? "–" : value}
              </span>
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[16px] bg-[var(--ink)] p-7 text-[var(--paper)] md:p-9">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="mono text-[10px] uppercase tracking-[.15em] text-[var(--accent)]">
                Việc cần xử lý
              </p>
              <h2 className="display mt-5 text-4xl font-bold leading-[.88]">
                Hôm nay có gì?
              </h2>
            </div>
            <span className="grid h-10 min-w-10 place-items-center rounded-full bg-white/10 text-sm font-bold">
              {needsAttention}
            </span>
          </div>
          <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
            <ActionRow
              href="/admin/messages"
              label="Tin nhắn chưa đọc"
              value={newMessages}
              icon={PaperPlaneTilt}
            />
            <ActionRow
              href="/admin/projects"
              label="Dự án đang là nháp"
              value={draftProjects}
              icon={FolderOpen}
            />
            <ActionRow
              href="/admin/articles"
              label="Bài viết đang là nháp"
              value={draftArticles}
              icon={PencilSimple}
            />
          </div>
        </div>
        <div className="rounded-[16px] border border-black/10 bg-[#dfe5d6] p-7 md:p-9">
          <p className="mono text-[10px] uppercase tracking-[.15em] text-black/45">
            Lối tắt
          </p>
          <h2 className="display mt-5 max-w-sm text-4xl font-bold leading-[.88]">
            Xuất bản điều đáng xem.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-black/60">
            Thêm một dự án hoặc bài viết mới, rồi xem trước trước khi đưa lên
            portfolio.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/admin/projects/new"
              className="button-accent focus-ring text-sm"
            >
              <Plus size={16} /> Dự án mới
            </Link>
            <Link
              href="/admin/articles/new"
              className="button-quiet focus-ring text-sm"
            >
              <FileText size={16} /> Bài viết mới
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <AdminLink
          href="/admin/projects"
          eyebrow="Portfolio"
          title="Sắp xếp câu chuyện dự án."
          description="Đánh dấu dự án nổi bật, điều chỉnh thứ tự và xuất bản khi mọi chi tiết đã sẵn sàng."
          label="Mở dự án"
        />
        <AdminLink
          href="/admin/analytics"
          eyebrow="Tín hiệu"
          title="Biết phần nào được đọc."
          description="Xem lượt xem, thời gian tương tác và hành động liên hệ mà không thu thập dữ liệu nhạy cảm."
          label="Mở phân tích"
        />
      </section>
    </div>
  );
}

function ActionRow({
  href,
  label,
  value,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: number | null;
  icon: typeof FolderOpen;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 py-4"
    >
      <span className="flex items-center gap-3 text-sm text-white/75">
        <Icon size={17} className="text-[var(--accent)]" />
        {label}
      </span>
      <span className="flex items-center gap-3 text-sm font-semibold">
        {value === null ? "–" : value}
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </span>
    </Link>
  );
}

function AdminLink({
  href,
  eyebrow,
  title,
  description,
  label,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[14px] border border-black/10 bg-[var(--paper)] p-7 transition-colors hover:border-black/25 md:p-9"
    >
      <p className="mono text-[10px] uppercase tracking-[.15em] text-black/45">
        {eyebrow}
      </p>
      <h2 className="display mt-5 text-4xl font-bold leading-[.88]">{title}</h2>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-black/55">
        {description}
      </p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
        {label}
        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </span>
    </Link>
  );
}
