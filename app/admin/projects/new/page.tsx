import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createProjectAction } from "../../actions";
import { ProjectEditorForm, type ProjectEditorValues } from "../../../components/admin/project-editor-form";

export const dynamic = "force-dynamic";

const values: ProjectEditorValues = {
  slug: "",
  title: "",
  category: "Web application",
  year: String(new Date().getFullYear()),
  duration: "",
  summary: { vi: "", en: "" },
  role: { vi: "", en: "" },
  teamContext: { vi: "", en: "" },
  stack: [],
  image: "",
  links: [],
  proofLinks: [],
  gallery: [],
  outcome: { vi: "", en: "" },
  sections: [],
  isFeatured: false,
  featuredOrder: 0,
  sortOrder: 0,
};

export default function NewProjectPage() {
  return <div>
    <Link href="/admin/projects" className="focus-ring mono inline-flex items-center gap-2 text-xs uppercase tracking-[.14em] text-black/50 hover:text-black"><ArrowLeft size={15} /> Projects</Link>
    <h1 className="display mt-8 text-6xl font-bold leading-[.8] md:text-8xl">New project</h1>
    <p className="mt-5 max-w-xl text-sm leading-relaxed text-black/55">Create a draft first. You can add the case-study gallery and narrative sections as JSON, then preview privately before publishing.</p>
    <ProjectEditorForm values={values} action={createProjectAction} isNew />
  </div>;
}
