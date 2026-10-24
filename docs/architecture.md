# Architecture

## Style

Use a modular monolith with vertical feature slices. Next.js owns rendering, server mutations, the Supabase Auth integration, analytics ingestion, and admin UI. This keeps deployment and authorization simple for a single-owner portfolio.

## Project structure

```text
app/
  (site)/
    layout.tsx
    page.tsx
    work/page.tsx
    work/[slug]/page.tsx
    about/page.tsx
    journal/page.tsx
    journal/[slug]/page.tsx
    contact/page.tsx
  (auth)/login/page.tsx
  admin/
    layout.tsx
    page.tsx
    profile/page.tsx
    projects/page.tsx
    projects/[id]/page.tsx
    articles/page.tsx
    media/page.tsx
    messages/page.tsx
    analytics/page.tsx
    settings/page.tsx
  api/
    analytics/events/route.ts
    analytics/rollup/route.ts
    contact/route.ts
    uploads/route.ts
  globals.css
  layout.tsx
app/components/
  site/               # Shared public shell, navigation, forms, and motion islands
  admin/              # Admin forms and media upload
  auth/               # Login/logout client islands
app/features/
  content/            # bilingual DTOs, reviewed fixture, Supabase repository
  contact/            # contact boundary schema
  analytics/          # analytics boundary schema
app/admin/actions.ts  # authenticated CMS commands and revalidation
app/lib/
  auth/
  env/
  errors/
  media/
  supabase/
supabase/
  migrations/
  seed.sql
public/
  media/
tests/
  e2e/
docs/
tasks/
```

## Design patterns

- Server Components first: public reads and initial admin reads remain server-side.
- Client Island: animation, filters, forms, uploads, and navigation behavior are isolated client leaves.
- Data Access Layer: public content reads stay in `app/features/content/repository.ts`; secure authorization stays in `app/lib/auth` and every admin action.
- Command Query Separation: reads use query functions; writes use explicit Server Actions.
- Repository boundary: Supabase rows never become public component props. Queries map rows to DTOs.
- Schema at the edge: Zod validates environment variables, form data, route requests, and uploaded metadata.
- Strategy: project case-study sections render by discriminated `type`, making new section types additive.
- Adapter: storage and analytics providers sit behind small interfaces so hosting can change.
- Optimistic concurrency: mutable records include `updatedAt` or `version`; stale edits return a conflict.

## Rendering and caching

- Home uses a 60-second route revalidation window; Work, About, Journal, and case-study pages resolve the current public repository on request so admin edits are visible without a rebuild.
- Admin routes are dynamic and never publicly cached.
- Successful content mutations call `revalidatePath` or cache tags for affected public routes.
- Draft previews use authenticated routes and are excluded from indexing.
- Images use `next/image`, explicit dimensions, AVIF/WebP, and responsive `sizes`.

## Dependency direction

```text
Route UI -> Feature query/action -> Domain schema/DTO -> Supabase server client -> PostgreSQL
Client island -> Server Action or Route Handler -> Authorization + validation -> Feature service
```

UI components do not import Supabase admin clients, secrets, session internals, or storage SDKs.
