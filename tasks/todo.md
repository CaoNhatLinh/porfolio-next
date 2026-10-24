# Execution checklist

Tasks are ordered by dependency. Each task should stay within one focused session and approximately five touched files. Split any task that grows beyond that boundary.

## Phase 0: Decisions and baseline

### T01 Approve the implementation contract

- [x] Confirm hosting (Vercel), Supabase, Vietnamese/English scope, single-owner Auth, Resend notification, and privacy-conscious analytics.
- [x] Change ADR statuses from `Proposed` to `Accepted`.
- Verify: owner explicitly approves `docs/product-spec.md`, `docs/architecture.md`, and ADRs.
- Dependencies: none.

### T02 Record the current baseline

- [ ] Run lint and build without modifying source.
- [ ] Record known failures, existing worktree changes, route screenshots, and current dependency audit.
- Verify: baseline report exists and distinguishes pre-existing issues.
- Dependencies: T01.

## Phase 1: Tooling and secure foundation

### T03 Install and configure dependencies

- [x] Install the approved runtime and development dependencies from `docs/dependencies.md`.
- [x] Add typecheck, unit, E2E, and Supabase seed scripts; remove the replaced Mantine prototype dependencies.
- Verify: clean install, lint, typecheck, and build run.
- Dependencies: T02.

### T04 Add test harness

- [x] Configure Vitest, Testing Library, jsdom, and Playwright.
- [x] Add unit coverage for locale/content/contact validation and one browser smoke test.
- [x] Verify: `npm run test` and `npm run test:e2e` pass.
- Dependencies: T03.

### T05 Add environment and error boundaries

- [x] Validate server and public environment variables with separate Zod schemas.
- [x] Add typed domain errors and structured action results.
- [ ] Verify: tests cover missing env and mapped validation errors.
- Dependencies: T03-T04.

### T06 Add Supabase schema and policies

- [x] Define SQL tables, indexes, foreign keys, RLS policies, Storage bucket, and seed path.
- [x] Create an idempotent migration and seed entry point using Supabase.
- Verify: anonymous, owner, and service-role access tests pass on an empty project.
- Dependencies: T05.

### T07 Implement Supabase single-owner authentication

- [x] Configure Supabase SSR client, email/password login, session refresh, and disabled sign-up at the application boundary.
- [x] Add an out-of-band owner seed script.
- [x] Protect admin reads and mutations at the DAL boundary.
- Verify: login/logout E2E; anonymous admin and action access are rejected.
- Dependencies: T06.

### Checkpoint A

- [x] Lint, types, unit, E2E, and build pass.
- [x] No public route can create an account.
- [x] Auth secrets and database credentials are absent from git.

## Phase 2: Content and design foundations

### T08 Extract Laravel content

- [x] Create a reviewed JSON fixture for profile and verified projects.
- [x] Flag unknown facts instead of inventing them.
- Verify: fixture validation reports no invalid URLs, duplicate slugs, or missing required fields.
- Dependencies: T05.

### T09 Migrate Laravel media

- [x] Copy source media non-destructively and record origin in `img template/README.md`.
- [ ] Optimize approved derivatives while preserving originals.
- Verify: media manifest resolves every migrated project asset.
- Dependencies: T08.

### T10 Seed real portfolio content

- [ ] Import normalized content and local media references idempotently.
- [ ] Assign reviewed featured and sort order values.
- Verify: running seed twice produces no duplicates; record count matches fixture.
- Dependencies: T06, T08-T09.

### T11 Implement design tokens and primitives

- [x] Add semantic color, spacing, type, radius, motion, and layer tokens.
- [ ] Implement accessible Button, Link, Field, Textarea, Select, Switch, Dialog, and Skeleton.
- Verify: component tests cover keyboard, focus, disabled, loading, and error states.
- Dependencies: T03-T04.

### T12 Implement shared shells

- [x] Add public navigation/footer, admin shell, route themes, and responsive mobile navigation.
- [x] Load fonts through `next/font`.
- Verify: desktop and mobile shells pass keyboard and reduced-motion checks.
- Dependencies: T07, T11.

### Checkpoint B

- [ ] One migrated project renders from the database in a design-system proof page.
- [ ] Light/dark contrast and responsive tokens are visually reviewed.
- [ ] No arbitrary colors or unapproved component library styles remain in the proof.

## Phase 3: Public vertical slices

### T13 Build Home

- [x] Render profile, navigation, and highest-priority featured project.
- [x] Implement motivated hero and project-entry motion with static reduced-motion fallback.
- Verify: home visual test at mobile and desktop; LCP asset is prioritized.
- Dependencies: T10-T12.

### T14 Build Work gallery

- [x] Render featured first, then stable ordered projects.
- [x] Add category filters with URL state.
- Verify: filtering, empty state, keyboard use, and direct URL restoration tests pass.
- Dependencies: T10-T12.

### T15 Build project case study

- [x] Add project metadata, media, outcomes, stack, and next project.
- Verify: published/draft/unknown-slug behavior and metadata tests pass.
- Dependencies: T14.

### T16 Build About and Lab

- [x] Render biography, principles, experience, tools, and Lab experiments.
- Verify: timeline is readable and linear on mobile and without CSS animation.
- Dependencies: T10-T12.

### T17 Build Journal

- [x] Implement index filters, article route, Markdown rendering, reading metadata, and published-content query.
- Verify: content rendering, malicious HTML handling, 404, sitemap, and metadata tests pass.
- Dependencies: T10-T12.

### T18 Build Contact

- [x] Implement accessible form, validation, honeypot, minimum completion time, rate limit, and success/error states.
- [x] Persist accepted messages and send Resend notification without exposing delivery results.
- Verify: happy path, validation, spam, rate limit, and network failure tests pass.
- Dependencies: T07, T10-T12.

### Checkpoint C

- [ ] Every public route uses real database content.
- [ ] Draft content is unavailable publicly.
- [ ] Mobile, keyboard, reduced-motion, and no-JavaScript checks pass.

## Phase 4: CMS vertical slices

### T19 Build profile editor

- [x] Edit core bilingual profile fields and profile media URL.
- Verify: authorized save updates public pages and invalid data stays unsaved.
- Dependencies: T07, T11-T12.

### T20 Build project management list

- [x] Add project list, status, featured toggle, explicit featured order, edit, publish, and archive actions.
- Verify: featured ordering changes public Work order after revalidation.
- Dependencies: T07, T10-T12.

### T21 Build project editor

- [x] Edit core bilingual fields, stack, image, outcome, and metadata.
- [x] Detect stale writes using optimistic concurrency.
- Verify: create-edit-preview-publish flow passes E2E; stale edit returns conflict.
- Dependencies: T20.

### T22 Build article editor

- [x] Add bilingual Markdown editing, reading metadata, draft, and publish actions.
- Verify: publish updates Journal; unsafe raw HTML is not rendered.
- Dependencies: T17, T19.

### T23 Build media library

- [x] Add authenticated upload, MIME/size validation, dimensions/alt-text metadata, and owner-scoped Storage paths.
- Verify: invalid upload rejection and referenced-media deletion protection pass.
- Dependencies: T07, T09, T11.

### T24 Build contact inbox

- [x] List, view, mark read, mark replied, and archive messages.
- Verify: status transitions and authorization tests pass.
- Dependencies: T18-T19.

### Checkpoint D

- [ ] Owner can maintain every public content type without editing source.
- [ ] Admin has loading, empty, error, conflict, and success states.
- [ ] Every mutation authenticates and revalidates affected public content.

## Phase 5: Analytics

### T25 Implement event ingestion

- [x] Normalize paths/referrers, rotate visitor hashes, exclude protected routes and bots, and return quickly.
- Verify: no raw IP is stored; ingestion failure never blocks navigation.
- Dependencies: T06-T07.

### T26 Implement rollups and retention

- [x] Aggregate daily metrics and delete expired raw events safely through the protected Vercel Cron route.
- [ ] Verify: idempotent aggregation tests match known fixture totals.
- Dependencies: T25.

### T27 Build analytics dashboard

- [x] Render visits, unique visitors, engaged time, top pages, and referrers with empty state.
- [ ] Lazy-load charts and provide text/table equivalents.
- Verify: known analytics fixtures render correct values and all non-success states.
- Dependencies: T26.

## Phase 6: Release quality

### T28 Complete SEO

- [x] Add route metadata, sitemap, robots, JSON-LD, and Open Graph defaults.
- Verify: metadata tests and a production crawl find no draft or admin URLs.
- Dependencies: T13-T18.

### T29 Accessibility and responsive audit

- [ ] Test 320, 375, 768, 1024, 1440, and 1920 px; keyboard; screen-reader landmarks; zoom; contrast; reduced motion.
- Verify: no critical/high automated or manual issues remain.
- Dependencies: T13-T24, T27.

### T30 Performance and resilience audit

- [ ] Profile LCP, INP, CLS, images, fonts, JS bundles, database queries, and admin chart loading.
- [ ] Add route-level loading, error, and not-found experiences.
- Verify: quality targets in the spec pass on production-like builds.
- Dependencies: T28-T29.

### T31 Security and operations review

- [ ] Review headers, CSP, sessions, uploads, rate limits, logs, backups, retention, restore, and rollback.
- Verify: backup restore and rollback runbooks are exercised once.
- Dependencies: T24-T30.

### T32 Production deployment

- [ ] Provision production environment, apply migration, seed owner, upload media, deploy, and run smoke tests.
- [ ] Update ADR statuses and README commands to match reality.
- Verify: production public routes and owner workflows pass; monitoring is active.
- Dependencies: T31.

### Final checkpoint

- [ ] All required commands pass from a clean checkout.
- [ ] Product success criteria are met.
- [ ] No unreviewed fictional content is published.
- [ ] Documentation matches the deployed system.

## External release gate

The source implementation is locally verified. The following require the owner's Supabase, Resend, and Vercel credentials and must be completed in the deployment environment:

- [ ] Apply the Supabase migration and run `npm run db:seed` with the real owner account.
- [ ] Configure Resend sender/recipient and submit one real contact smoke test.
- [ ] Set Vercel Preview/Production environment variables, deploy, and verify the cron schedule.
- [ ] Run anonymous/owner RLS checks, media upload, publish/revalidation, analytics rollup, backup/restore, and rollback smoke tests.

## Completion pass

### T33 Admin interaction primitives

- [x] Add local shadcn-style Button, Dialog, Select, and Status primitives using the existing tokens.
- [x] Use them for archive confirmation, publish feedback, filters, and empty/error states.
- Verify: keyboard focus, escape, disabled, pending, and alert states.

### T34 Analytics visualization

- [x] Add a date-range control and daily page-view/unique-visitor chart.
- [x] Keep a semantic table fallback and lazy-load the chart client island.
- Verify: empty, partial, and populated datasets render correctly.

### T35 Project CRUD and ordering

- [x] Add create, edit, archive, restore, and explicit sort-order controls.
- [x] Edit typed case-study sections, links, and gallery media metadata.
- Verify: owner-only mutation, slug validation, featured ordering, and stale-write conflict.

### T36 Article authoring and preview

- [x] Add create, archive/restore, preview, and publish/unpublish workflows.
- [x] Keep preview noindex and prevent draft content from public queries and sitemap.
- Verify: Markdown safety, slug uniqueness, preview access, and publish revalidation.

### T37 Profile and release polish

- [x] Edit availability, social links, SEO defaults, and profile media from admin.
- [x] Add confirmation and success/error feedback to destructive and external-link actions.
- Verify: bilingual output, responsive admin navigation, and no visual regression against v3 references.

## Phase 8: Portfolio vitality and hiring conversion

### T38 Approve the UX and content contract

- [ ] Confirm the CV source, public display name, current role, engagement modes, response promise, and public contact email.
- [ ] Confirm the route names `/resume` and `/hire` and the primary CTA labels in both locales.
- Verify: decisions are recorded in `docs/portfolio-ux-audit.md` and no fictional resume facts are introduced.
- Dependencies: T37.

### T39 Extend profile, project, lab, and message contracts

- [x] Add bilingual resume metadata, availability status, engagement modes, response time, project proof fields, lab item fields, and message intent.
- [x] Add Supabase migration, RLS coverage, fixture updates, and owner-only validation for profile and project proof fields.
- [x] Add owner CRUD for Lab items.
- Verify: migration is idempotent, existing public content remains readable, and invalid proof URLs are rejected.
- Dependencies: T38.

### T40 Build the public Resume route

- [x] Implement a bilingual, print-friendly resume page with identity rail, experience evidence, skills in context, update date, and download/print actions.
- [x] Add missing-PDF, keyboard, mobile, and reduced-motion behavior; route-level loading/not-found conventions remain shared with the site shell.
- Verify: recruiter can read the CV without downloading a PDF; print output is legible; download analytics fires without blocking navigation.
- Dependencies: T39.

### T41 Build the focused Hire flow

- [x] Add a bilingual fit selector and compact brief form for full-time, freelance, consulting, and conversation intents.
- [x] Reuse Contact's validation, honeypot, rate limit, Supabase persistence, and Resend notification with an explicit `intent` field.
- [x] Provide direct email, response promise, success, validation, spam, and network-failure states.
- Verify: happy path and all error paths pass; submitted messages never expose provider details or store raw IPs.
- Dependencies: T39.

### T42 Revive About, Tools, and Lab

- [x] Replace the static tool word wall with capability-to-project evidence links.
- [x] Replace equal Lab cards with one featured experiment plus stateful experiment rows and real demo/repository actions.
- [x] Shorten the pale section, vary the composition, and keep the green register purposeful.
- Verify: every visible item has an action or evidence; the page has no dead space at 320, 768, and 1440 px.
- Dependencies: T40.

### T43 Strengthen Work and case-study proof

- [x] Surface role, duration, team context, outcome, and proof links before the stack.
- [x] Add end-of-case-study CTAs to Resume and Hire with a relevant project handoff.
- Verify: featured ordering and filters remain correct; direct case-study links preserve locale; no draft content leaks.
- Dependencies: T39-T42.

### T44 Add cross-site CTA and composition pass

- [x] Promote Resume and Hire me in header, mobile nav, homepage hero, footer, and relevant page endings.
- [x] Give Home, Work, About, Resume, and Hire distinct composition families while retaining shared tokens and the Kamling signature.
- [x] Add restrained artifact reveal, hover, and form feedback motion with reduced-motion fallbacks.
- Verify: no page has more than one primary CTA; keyboard focus and contrast pass; no horizontal overflow.
- Dependencies: T40-T43.

### T45 Add hiring conversion analytics

- [x] Track `resume_view`, `resume_print`, `resume_download`, `hire_start`, and `hire_submit`; existing page-view/contact tracking remains active.
- [x] Exclude admin, preview, login, bots, raw message bodies, and sensitive query values.
- [x] Add event breakdowns to the private analytics dashboard.
- Verify: events aggregate in the private dashboard and ingestion failure never blocks page navigation.
- Dependencies: T25-T27, T40-T44.

### T46 Hiring-ready quality gate

- [ ] Run accessibility, responsive, print, performance, metadata, security, and content-proof audits for `/`, `/about`, `/work`, `/resume`, `/hire`, and `/contact`.
- [ ] Add unit and E2E coverage for resume access/download, hiring intent, bilingual validation, and CTA routing.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build` from a clean state.
- Verify: all acceptance criteria in `docs/portfolio-ux-audit.md` pass before deployment.
- Dependencies: T38-T45.

## Phase 9: UI/UX V2 evidence and conversion pass

The detailed design rationale and route strategy are in `docs/ui-ux-v2-plan.md`.

### T47 Record the V2 visual and usability baseline

**Description:** Capture the current public experience before further visual changes so each improvement can be compared against evidence.

**Acceptance criteria:**

- [ ] Desktop and mobile screenshots exist for all primary routes at the required breakpoints.
- [ ] Heading overflow, kicker count, duplicate CTA intent, keyboard order, contrast, and misleading media are recorded per route.
- [ ] LCP, CLS, console errors, failed requests, and current funnel events are recorded.

**Verification:** Review the baseline report and screenshot index against `/`, `/work`, one case study, `/about`, `/journal`, `/resume`, `/hire`, and `/contact`.

**Dependencies:** T46.

**Files likely touched:** `docs/ui-ux-v2-baseline.md`, `docs/ui-ux-v2-plan.md`, `tasks/todo.md`.

**Estimated scope:** Medium.

### T48 Correct the shared visual hierarchy

**Description:** Fix the type scale and repeated visual grammar before recomposing individual routes.

**Acceptance criteria:**

- [x] Display type never exceeds the 6rem desktop ceiling or -0.04em tracking floor.
- [ ] Kicker count is no more than one per three sections and CTA intent is not duplicated in the header.
- [ ] Shared buttons, links, fields, media, focus, pressed, loading, empty, success, and error states follow one radius and contrast system.

**Verification:** Run responsive screenshots, keyboard focus check, contrast check, lint, typecheck, and component tests.

**Dependencies:** T47.

**Files likely touched:** `app/globals.css`, `app/components/site/site-header.tsx`, `app/components/site/site-footer.tsx`, `app/components/ui/button.tsx`, `docs/design-system.md`.

**Estimated scope:** Medium.

### T49 Recompose Home around one proof

**Description:** Make the first viewport answer identity, specialization, strongest proof, and the next action without competing manifesto sections.

**Acceptance criteria:**

- [x] Hero contains one claim, one supporting sentence, and only `View work` plus `View CV` actions.
- [x] Current role or specialization, availability, and strongest verified proof are factual and visible in the first viewport.
- [x] One verified project outcome appears directly after the hero.
- [ ] Home uses no more than four composition families and one final Hire invitation.

**Verification:** Test the first viewport at 320, 768, 1024, and 1440px; confirm primary CTAs remain visible and LCP media is prioritized.

**Dependencies:** T48 and owner-approved strongest proof.

**Files likely touched:** `app/(site)/page.tsx`, `app/components/site/project-card.tsx`, `app/features/content/data.ts`, `app/globals.css`.

**Estimated scope:** Medium.

### T50 Improve Work comparison and filter UX

**Description:** Help visitors compare projects by responsibility and outcome, then select the most relevant case study.

**Acceptance criteria:**

- [x] Every tile exposes category, role, and one outcome or proof line.
- [ ] Grid/list state and category remain shareable in the URL with an actionable empty state.
- [x] No label is overlaid on project imagery and no grid ends with an artificial empty cell.

**Verification:** Test every filter, direct URL restoration, grid/list switching, keyboard order, 320px overflow, and project link locale preservation.

**Dependencies:** T48.

**Files likely touched:** `app/(site)/work/page.tsx`, `app/components/site/project-card.tsx`, `app/features/content/types.ts`, `app/features/content/repository.ts`.

**Estimated scope:** Medium.

### T51 Upgrade the featured case-study evidence model

**Description:** Turn one featured project into the quality bar for context, responsibility, constraints, decisions, evidence, outcome, and reflection.

**Acceptance criteria:**

- [ ] The case study follows the approved narrative order and contains at least three real artifacts.
- [ ] Metrics are shown only when their source is verified and owner-approved.
- [ ] Live, repository, video, or external proof links sit next to the claims they verify; dense implementation detail uses progressive disclosure.
- [ ] The final conversion pair is limited to `View CV` and `Send brief`.

**Verification:** Compare public output with the admin data, test missing sections/media, confirm no draft content leaks, and review both locales.

**Dependencies:** T50 and verified owner content.

**Files likely touched:** `app/(site)/work/[slug]/page.tsx`, `app/features/content/types.ts`, `app/features/content/repository.ts`, `app/components/admin/project-editor-form.tsx`, `supabase/migrations/202608290002_portfolio_vitality.sql`.

**Estimated scope:** Medium.

### T52 Optimize Resume for recruiter scanning

**Description:** Reorder the CV so the visitor can determine role, availability, strongest impact, experience, and contact path in 20 seconds.

**Acceptance criteria:**

- [x] Above the fold contains identity, current role, location, availability, short positioning, strongest proof, and print/download actions.
- [x] Selected impact precedes chronology and every experience link opens relevant evidence.
- [ ] Experience rows preserve a scan-first summary and reveal deeper responsibilities, tools, and outcomes only when useful.
- [ ] Mobile has a print-hidden sticky action bar and A4 print output remains clean.

**Verification:** Conduct a timed recruiter scan, keyboard and 200% zoom check, 320px check, print preview, PDF output, and bilingual parity review.

**Dependencies:** T48, T51, and final CV decision.

**Files likely touched:** `app/(site)/resume/page.tsx`, `app/components/site/resume-actions.tsx`, `app/features/content/resume.ts`, `app/globals.css`.

**Estimated scope:** Medium.

### T53 Simplify Hire and Contact intent

**Description:** Separate hiring opportunities from general messages and reduce initial form effort through progressive disclosure.

**Acceptance criteria:**

- [ ] Hire begins with name, email, intent, and project context; timing, budget, and website appear only for hiring intent.
- [ ] Contact remains the general channel with direct email fallback.
- [ ] Success state shows response expectation and a relevant project without exposing delivery-provider details.

**Verification:** Test every intent, validation, keyboard flow, autofill, pending, success, spam, network error, and locale state.

**Dependencies:** T48 and T52.

**Files likely touched:** `app/(site)/hire/page.tsx`, `app/(site)/contact/page.tsx`, `app/components/site/contact-form.tsx`, `app/features/contact/schema.ts`, `tests/contact-schema.test.ts`.

**Estimated scope:** Medium.

### T54 Replace misleading Lab and Journal media

**Description:** Give experiments and articles their own visual identities and remove unrelated project-image fallbacks.

**Acceptance criteria:**

- [x] Every published Lab item has a real cover or a clearly marked text-first missing-cover state.
- [ ] Every published article has a content-specific cover with bilingual alt text.
- [ ] Admin preview matches public crops, focal point, captions, and missing-media behavior.

**Verification:** Run media inventory validation, broken-image test, alt-text review, crop review at mobile/desktop, and content-owner approval.

**Dependencies:** T47 and owner-provided or approved generated source material.

**Files likely touched:** `app/(site)/about/page.tsx`, `app/(site)/journal/page.tsx`, `app/features/content/articles-content.ts`, `app/features/content/data.ts`, `public/media/manifest.json`.

**Estimated scope:** Medium.

### T55 Add route-specific motion and article reading UX

**Description:** Replace uniform section reveals with motion and reading interactions that explain hierarchy, state change, and progress.

**Acceptance criteria:**

- [ ] Hero, project media, filters, forms, and article navigation each use a behavior suited to their job.
- [ ] Long articles provide heading anchors, optional table of contents, reading progress, and code-copy feedback.
- [ ] Content is visible before hydration and all motion has a reduced-motion alternative.

**Verification:** Check slow hydration, hidden-tab behavior, reduced motion, keyboard use, console cleanup, and motion performance on a mid-range mobile viewport.

**Dependencies:** T49-T54.

**Files likely touched:** `app/components/site/reveal.tsx`, `app/components/site/markdown-article.tsx`, `app/(site)/journal/[slug]/page.tsx`, `app/components/site/article-progress.tsx`, `app/globals.css`.

**Estimated scope:** Medium.

### T56 Complete the UI/UX V2 release gate

**Description:** Verify that the improved portfolio is accessible, fast, truthful, resilient, bilingual, and conversion-ready.

**Acceptance criteria:**

- [ ] All V2 definition-of-done items pass with no P0 or P1 finding.
- [ ] Primary funnel events work without storing sensitive content or blocking navigation.
- [ ] Documentation, final screenshots, owner-editable fields, and deployment checklist match the shipped UI.

**Verification:** Run lint, typecheck, unit tests, E2E, production build, accessibility audit, Lighthouse-style audit, print review, and real-browser smoke tests at all supported widths.

**Dependencies:** T47-T55.

**Files likely touched:** `tests/e2e/public.spec.ts`, `docs/ui-ux-v2-baseline.md`, `docs/ui-ux-v2-plan.md`, `docs/design-system.md`, `tasks/todo.md`.

**Estimated scope:** Medium.
