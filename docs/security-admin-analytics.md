# Security, admin, and analytics

## Authentication

- Supabase Auth with email/password and database sessions.
- Public sign-up disabled in Supabase Auth and at the application boundary.
- One admin account created by an out-of-band seed or CLI command.
- Secure, HTTP-only, SameSite cookies in production.
- Supabase Auth provides provider-side throttling; the login UI uses a generic failure message to reduce enumeration.
- The admin shell exposes sign-out; global session revocation remains a Supabase dashboard operation.

Route-level redirects improve UX, but authorization must also run inside the DAL, every Server Action, every protected Route Handler, and upload signing.

## Admin safety

- Validate all input with Zod at the boundary.
- Escape Markdown output and do not enable arbitrary raw HTML.
- Archive is a soft status transition; add an explicit confirmation step before enabling destructive media cleanup.
- Prefer soft archive for published content.
- Use optimistic concurrency to prevent silent overwrites.
- Record an audit log for publish, archive, and content edits. Login and settings changes are handled by Supabase/Vercel controls rather than local mutation actions.
- Keep secrets in environment variables validated at startup.
- Add CSP, frame protection, referrer policy, permissions policy, and secure headers.

## Analytics

Collect only what is needed for portfolio decisions:

- Page path and timestamp.
- Referrer domain, never the full sensitive URL.
- Device family and viewport group.
- Country code when the platform already provides it.
- Daily rotating, salted visitor hash for approximate unique visits.

Vercel Cron calls `/api/analytics/rollup` daily with `CRON_SECRET`. It upserts daily aggregates and deletes raw events older than 90 days; the endpoint never accepts browser analytics payloads.

Do not store raw IP addresses. Retain raw events for 90 days, retain daily aggregates, and exclude `/admin`, `/login`, previews, bots, and the owner's opt-out cookie.

Admin metrics:

- Visits, unique visitors, page views, and average engaged time.
- Top pages, referrers, device groups, and countries.
- The current dashboard covers a fixed 30-day window with empty and partial-data states. Date-range comparison and charts remain follow-up enhancements.

## Contact abuse controls

- Honeypot and minimum form completion time.
- Per-hash rate limit in a rolling window.
- Server-side length, format, and allowlist validation.
- Optional Turnstile only if real abuse appears.
- Never reveal whether an email notification succeeded.

## Release security checks

- Dependency audit reviewed, not blindly auto-fixed.
- No `.env` or credentials in git.
- Admin paths return no protected data without a valid session.
- Uploads reject executable and oversized content.
- Logs avoid request bodies and session IDs; contact delivery logs contain only provider/error summaries.
