# Dependencies and commands

## Current baseline

The project uses Next.js 16.3.3, React 19.2, TypeScript 5, Tailwind CSS 4, Motion, Phosphor Icons, and Node.js 22.21.1. The original Mantine and Embla prototype dependencies have been removed.

## Runtime dependencies

```powershell
npm install motion @phosphor-icons/react zod react-hook-form @hookform/resolvers clsx tailwind-merge server-only
npm install @supabase/supabase-js @supabase/ssr resend
npm install react-markdown remark-gfm
npm install recharts @radix-ui/react-alert-dialog @radix-ui/react-select
```

## Development dependencies

```powershell
npm install --save-dev vitest @vitest/coverage-v8 jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
npx playwright install
```

Supabase is intentional because it provides the requested Auth, PostgreSQL, and Storage in one managed platform that integrates cleanly with Vercel.

The old Mantine, Embla, Day.js, and PostCSS variable dependencies were removed after the public shell was replaced and the production build passed. Recharts is isolated to the admin analytics client island; Radix Alert Dialog and Select provide keyboard-safe admin controls without imposing a second visual system on the public site.

## Required scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "db:seed": "node scripts/seed-supabase.mjs"
}
```

## Environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
ADMIN_EMAIL=
ANALYTICS_SALT=
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Validate them in `app/lib/env/server.ts`; client-visible variables use `app/lib/env/public.ts`. Never expose the service-role key to browser code.

## Database workflow

Supabase SQL migrations and seed scripts replace the ORM migration commands:

```powershell
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
npm run db:seed
```

The exact Supabase CLI setup is environment-specific, so the project stores SQL migrations under `supabase/migrations` and documents the linked project ref outside git.

## Verification commands

```powershell
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Official references:

- https://nextjs.org/docs/app
- https://tailwindcss.com/docs/installation/framework-guides/nextjs
- https://motion.dev/docs/react
- https://supabase.com/docs/guides/auth/server-side/nextjs
- https://supabase.com/docs/guides/storage
- https://resend.com/docs/send-with-nodejs
- https://zod.dev/packages/zod
- https://vitest.dev/guide/
- https://playwright.dev/docs/intro
- https://recharts.org/en-US/api
- https://www.radix-ui.com/primitives/docs/components/alert-dialog
- https://www.radix-ui.com/primitives/docs/components/select
