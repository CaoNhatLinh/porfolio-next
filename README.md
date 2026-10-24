# Cao Nhat Linh Portfolio

A multi-page developer portfolio built with Next.js 16 App Router. It includes an art-directed bilingual public site, project case studies, technical writing, a Supabase-backed private content area, contact delivery through Resend, and privacy-conscious analytics.

## Planning entry points

- [Documentation index](./docs/README.md)
- [Product specification](./docs/product-spec.md)
- [Architecture](./docs/architecture.md)
- [Design system](./docs/design-system.md)
- [Roadmap](./tasks/plan.md)
- [Task checklist](./tasks/todo.md)
- [Vercel deployment runbook](./docs/deployment.md)
- [Visual templates](./img%20template/README.md)

## Local development

```powershell
npm install
npm run dev
npm run typecheck
npm run build
```

The full dependency, environment, migration, and release matrix is documented in [`docs/dependencies.md`](./docs/dependencies.md).

## Routes

- `/` art-directed bilingual landing page
- `/work` project index with featured priority
- `/work/[slug]` case studies
- `/about` profile, principles, experience, and lab
- `/resume` bilingual, print-friendly CV with evidence links and availability
- `/hire` focused hiring brief flow with intent, timeline, Resend delivery, and Supabase inbox
- `/journal` and `/journal/[slug]` technical notes
- `/contact` validated contact form with email delivery boundary
- `/login` and `/admin/*` private Supabase Auth workspace
- `/admin/projects/new`, `/admin/articles/new` create draft content; editor pages support bilingual fields, featured/sort order, galleries, and case-study sections
- `/admin/lab` owner-only Lab experiment editor with publish state and demo/repository links
- `/preview/projects/[id]` and `/preview/articles/[id]` owner-only noindex draft previews

Without Supabase environment variables, public pages use the verified Laravel-derived fixture content so the design can be reviewed locally. Once the Supabase migration and seed are applied, published records take precedence.

## Source content

Verified profile and project content has been staged from the Laravel source at `E:/WORKSPACE/portfolio/a`. Generated templates under [`img template`](./img%20template/README.md) are visual references only and must not be treated as factual project data.

## Environment

Copy `.env.example` to `.env.local`, fill the Supabase and Resend values, and set `ADMIN_EMAIL` to the one owner account. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.
