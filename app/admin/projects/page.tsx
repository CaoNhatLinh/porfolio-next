import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Plus,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import {
  setProjectFeaturedAction,
  setProjectSortOrderAction,
} from "../actions";
import { ContentControls } from "../../components/admin/content-controls";
import { ActionForm } from "../../components/admin/action-form";
import { ListToolbar, Pagination } from "../../components/admin/list-toolbar";
import { listParams, searchPattern } from "../list-query";
import { Button } from "../../components/ui/button";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";
import { getAdminUser } from "../../lib/auth/admin";

export const dynamic = "force-dynamic";

async function loadProjects(params: ReturnType<typeof listParams>) {
    const user = await getAdminUser();
    if (!user) throw new Error("Unauthorized");
    let query = createSupabaseAdminClient()
      .from("projects")
      .select(
        "id, slug, title, category, image_url, status, is_featured, featured_order, sort_order, updated_at", { count: "exact" },
      )
      .eq("owner_id", user.id)
      .order("status")
      .order("is_featured", { ascending: false })
      .order("featured_order")
      .order("sort_order").order("id");
    if (params.status) query = query.eq("status", params.status);
    if (params.q) query = query.ilike("title", searchPattern(params.q));
    const { data, count, error } = await query.range((params.page - 1) * 20, params.page * 20 - 1);
    if (error) throw new Error("Unable to load projects.");
    return { projects: data ?? [], total: count ?? 0 };
}

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; status?: string }> }) {
  const params = listParams(await searchParams);
  const { projects, total } = await loadProjects(params);
  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mono text-xs uppercase tracking-[.15em] text-black/45">
            Nội dung / portfolio
          </p>
          <h1 className="display mt-3 text-6xl font-bold leading-[.8]">
            Dự án
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-xs text-black/45">
            {projects.length} bản ghi
          </span>
          <Link href="/admin/projects/new">
            <Button variant="accent">
              <Plus size={16} /> Dự án mới
            </Button>
          </Link>
        </div>
      </header>
      <ListToolbar q={params.q} status={params.status} />
      <div className="mt-6 overflow-hidden rounded-[14px] border border-black/10 bg-[var(--paper)]">
        {projects.length === 0 ? (
          <Empty text="Chưa có dự án phù hợp. Thêm dự án mới hoặc thay đổi bộ lọc." />
        ) : (
          projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))
        )}
      </div>
      <Pagination page={params.page} total={total} base="/admin/projects" params={{ q: params.q, status: params.status }} />
      <p className="mt-5 text-sm text-black/50">
        Dự án nổi bật xuất hiện trước ở trang Work. Đổi thứ tự bằng số, sau đó
        xuất bản khi nội dung đã sẵn sàng.
      </p>
    </div>
  );
}

function ProjectRow({
  project,
}: {
  project: {
    id: string;
    slug: string;
    title: string;
    category: string;
    image_url: string | null;
    status: string;
    is_featured: boolean;
    featured_order: number;
    sort_order: number;
    updated_at: string;
  };
}) {
  const archived = project.status === "ARCHIVED";
  return (
    <div className="grid gap-5 border-b border-black/10 p-5 last:border-b-0 md:grid-cols-[1.35fr_.55fr_.65fr_auto] md:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-black/10 bg-[#dfe5d6] text-xs font-semibold text-black/55">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            project.title.slice(0, 1)
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={`/admin/projects/${project.id}`}
            className="group inline-flex max-w-full items-center gap-2 text-lg font-medium"
          >
            <span className="truncate">{project.title}</span>
            <ArrowUpRight
              size={15}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
          <p className="mono mt-1 text-[10px] uppercase text-black/45">
            {project.category} / {statusLabel(project.status)}
          </p>
        </div>
      </div>
      <div className="text-sm text-black/55">
        Cập nhật {new Date(project.updated_at).toLocaleDateString("vi-VN")}
      </div>
      <div className="flex items-center gap-3">
        {project.is_featured ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-ink)]">
            <Star size={15} weight="fill" /> Nổi bật
          </span>
        ) : (
          <span className="text-xs text-black/40">Tiêu chuẩn</span>
        )}
        <ActionForm
          action={setProjectSortOrderAction}
          className="flex items-center gap-2"
        >
          <label htmlFor={`sort-${project.id}`} className="sr-only">
            Thứ tự của {project.title}
          </label>
          <input
            id={`sort-${project.id}`}
            name="sortOrder"
            type="number"
            min="0"
            max="9999"
            defaultValue={project.sort_order ?? 0}
            className="form-input h-9 w-16 !border-black/15 !px-2 !text-[var(--ink)]"
          />
          <input type="hidden" name="id" value={project.id} />
          <button
            type="submit"
            className="focus-ring rounded-full border border-black/15 px-2 py-2 text-xs hover:bg-black/5"
            aria-label={`Lưu thứ tự của ${project.title}`}
          >
            <Check size={14} />
          </button>
        </ActionForm>
      </div>
      <div className="flex flex-wrap gap-2">
        {!archived && (
          <>
            <ActionForm action={setProjectFeaturedAction}>
              <input type="hidden" name="id" value={project.id} />
              <input
                type="hidden"
                name="featured"
                value={project.is_featured ? "false" : "true"}
              />
              <input
                type="hidden"
                name="order"
                value={project.featured_order ?? 0}
              />
              <Button variant="outline" type="submit">
                {project.is_featured ? "Bỏ nổi bật" : "Nổi bật"}
              </Button>
            </ActionForm>
          </>
        )}
        <ContentControls table="projects" id={project.id} status={project.status} updatedAt={project.updated_at} />
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  return status === "PUBLISHED"
    ? "Đã xuất bản"
    : status === "ARCHIVED"
      ? "Lưu trữ"
      : "Bản nháp";
}

function Empty({ text }: { text: string }) {
  return (
    <div className="p-8 text-sm text-black/55">
      <Check size={20} className="text-[var(--accent-ink)]" />
      <p className="mt-4 max-w-md">{text}</p>
    </div>
  );
}
