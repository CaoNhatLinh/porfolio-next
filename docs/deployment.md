# Deployment runbook: Vercel + Supabase

## 1. Supabase project

1. Create one Supabase project and keep the region close to the expected audience.
2. In **Authentication → Providers**, enable Email and disable public sign-ups.
3. Create exactly one owner account using the real admin email.
4. Run the migrations in order: `0001_initial.sql`, `0002_completion_pass.sql`, then `0003_portfolio_vitality.sql` in the SQL editor or with `npx supabase db push`.
5. Set the local environment from `.env.example` and run `npm run db:seed` once. The script resolves the owner by `ADMIN_EMAIL` and upserts the profile, projects, articles, and Lab experiments.
6. Create or confirm the public `portfolio-media` bucket. The migration adds Storage RLS policies; uploaded files are scoped under the owner UUID.

## 2. Resend

1. Create a Resend API key.
2. Verify the sending domain and set `FROM_EMAIL` to an address on that domain. The default `onboarding@resend.dev` is suitable only for initial testing.
3. Set `CONTACT_NOTIFICATION_EMAIL` to the inbox that should receive portfolio messages.

## 3. Vercel

1. Import this repository into Vercel with the Next.js preset. No custom build command is required.
2. Add every variable from `.env.example` to **Production**, **Preview**, and **Development** as appropriate:

   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `RESEND_API_KEY`
   - `CONTACT_NOTIFICATION_EMAIL`
   - `FROM_EMAIL`
   - `ANALYTICS_SALT`
   - `CRON_SECRET`

3. Redeploy after saving environment variables.
4. Add the Vercel production URL to `NEXT_PUBLIC_SITE_URL`, then redeploy again so sitemap, robots, Open Graph, and JSON-LD use the canonical host.

## 4. Smoke checklist

```powershell
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run test:e2e
npm run build
```

- Open `/`, `/work`, `/about`, `/journal`, and `/contact` in both `?lang=vi` and `?lang=en`.
- Submit one test contact note and confirm the Supabase row and Resend notification.
- Sign in at `/login`, verify `/admin` is protected, edit a profile field, and confirm it appears publicly after revalidation.
- Upload one image in `/admin/media` and use its URL in a project.
- Verify analytics excludes `/admin`, `/login`, bots, and raw IP values.

## Rollback

Vercel keeps previous deployments available for instant rollback. Supabase migrations are append-only in production; revert application code first, then add a forward migration for any schema correction. Do not delete production media during a content rollback.
