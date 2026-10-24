# Implementation plan: Multi-page developer portfolio

## Overview

Rebuild the current one-page prototype as a production multi-page portfolio, migrate verified content from Laravel, and add a private single-owner CMS with project prioritization, messages, media, and privacy-conscious analytics.

## Dependency graph

```text
Approved spec and ADRs
  -> dependencies, environment, test harness
  -> database schema and auth
  -> Laravel content migration
  -> design tokens and shared shells
  -> public vertical slices
  -> admin vertical slices
  -> analytics and contact hardening
  -> accessibility, performance, SEO, release
```

## Architecture decisions

- Modular monolith in Next.js App Router.
- Supabase PostgreSQL, Auth, and Storage on Vercel.
- Supabase Auth sessions, no public sign-up.
- Custom Tailwind v4 token system with small purpose-built primitives and client islands where behavior is complex.
- Motion only in isolated client components.
- Server Components for reads, authenticated Server Actions for CMS writes.
- First-party aggregate analytics with no stored raw IP.

## Roadmap

### Phase 0: Approval and baseline

- Approve scope, routes, hosting, database, language, auth recovery, and analytics retention.
- Capture current build, lint, screenshots, and content inventory.
- Protect existing user changes and avoid mixing unrelated refactors.

### Phase 1: Foundation

- Install approved dependencies and remove replaced prototype dependencies after the new shell is green.
- Add environment validation, test harness, CI-ready commands, error model, and logging boundary.
- Add Supabase SQL migrations, seed path, Auth, Storage policies, and protected admin shell.

### Checkpoint: Secure foundation

- Anonymous requests cannot read or mutate admin data.
- Database migration and owner seed are repeatable.
- Lint, types, unit tests, and build pass.

### Phase 2: Content and design foundations

- Extract Laravel content into a reviewed seed fixture.
- Copy and optimize approved media non-destructively.
- Implement semantic tokens, typography, primitives, public shell, admin shell, and motion policy.

### Checkpoint: Content and design proof

- One real project renders from PostgreSQL in both public preview and admin read-only view.
- Light and dark route themes match the v3 templates.
- Keyboard and reduced-motion checks pass for the shared shells.

### Phase 3: Public portfolio slices

- Home introduction and featured teaser.
- Work gallery with filtering and featured ordering.
- Project case study with flexible sections and metadata.
- About and Lab.
- Journal index and article detail.
- Contact page and protected submission flow.

### Checkpoint: Public beta

- All public routes use real content and media.
- Drafts are inaccessible and excluded from metadata.
- Mobile, tablet, desktop, keyboard, reduced-motion, and no-JavaScript fallbacks are checked.

### Phase 4: CMS slices

- Profile and social-link editing.
- Project list, create/edit, media, ordering, featured state, preview, publish, archive.
- Article create/edit, preview, publish, archive.
- Media library and contact inbox.

### Checkpoint: Owner workflow

- The owner can update every public content type without source changes.
- Publish and featured changes invalidate the correct public cache.
- Stale edits return a visible conflict instead of overwriting data.

### Phase 5: Analytics

- Add non-blocking event ingestion, bot exclusion, owner opt-out, daily aggregation, retention, and admin dashboards.
- Verify analytics never tracks admin, login, preview, or sensitive query values.

### Phase 6: Quality and release

- SEO metadata, sitemap, robots, JSON-LD, Open Graph.
- Accessibility audit, performance profiling, image optimization, bundle review, security headers, backup and rollback runbook.
- Production deployment, migration, smoke tests, monitoring, and launch checklist.

### Phase 7: Completion pass

- Add a small shadcn-style admin primitive layer without changing the public art direction.
- Add an accessible analytics chart and date-range controls while preserving the table fallback.
- Complete owner CRUD for projects and articles, explicit ordering, richer profile fields, media/section editing, and draft preview.
- Verify the new flows with unit, E2E, production build, and security checks before the external Vercel/Supabase gate.

### Phase 8: Portfolio vitality and hiring conversion

The current public shell is coherent but several pages feel static because the same typographic composition repeats and the hiring path is implicit. This phase turns whitespace into narrative, tools into evidence, and Contact into a focused conversion system. Detailed findings live in `docs/portfolio-ux-audit.md`.

- Add first-class `/resume` and `/hire` routes in Vietnamese and English.
- Promote Resume and Hire me in the public header, mobile navigation, homepage hero, case-study endings, and footer.
- Replace About's static tools wall with evidence-linked capabilities and replace the Lab card row with a featured experiment plus live/prototype/archive states.
- Enrich project proof with role, duration, team context, outcome, and evidence links while preserving featured ordering.
- Extend the owner CMS for resume metadata, engagement modes, lab items, project proof fields, and hiring message intent.
- Add conversion analytics for resume views/downloads, hire starts/submits, and case-study CTAs.
- Run a composition and motion pass so Home, Work, About, Resume, and Hire each have a distinct job and rhythm.

### Checkpoint: Hiring-ready public beta

- A recruiter reaches a readable CV or focused hiring brief in one click from every primary page.
- Every visible Tools/Lab item has evidence, a state, or an action.
- Public pages have no dead-end CTA, no horizontal overflow at 320 px, and reduced-motion fallbacks.
- Owner can update all resume, hiring, lab, and proof content from Admin without source edits.

### Phase 9: UI/UX V2 evidence and conversion pass

The next pass moves the portfolio from visually expressive to consistently persuasive. The detailed route strategy, design constraints, acceptance criteria, and owner-input list live in `docs/ui-ux-v2-plan.md`.

- Correct the shared type scale, kicker cadence, duplicate CTA hierarchy, route theme discipline, and interaction states.
- Recompose Home around identity, one featured proof, and a direct Work/CV decision.
- Strengthen Work and featured case studies with verified responsibility, constraints, decisions, artifacts, and outcomes.
- Optimize Resume for a 20-second recruiter scan and simplify Hire through progressive disclosure.
- Replace unrelated Lab and Journal fallback images with content-specific assets.
- Replace repeated reveal behavior with motivated route-specific motion while preserving visible-by-default and reduced-motion behavior.
- Complete accessibility, responsive, performance, print, content-truth, and conversion-funnel audits.

### Checkpoint: Persuasive portfolio release candidate

- Home -> Work -> case study -> Resume/Hire is clear in both locales and works with keyboard and touch.
- No public claim or media asset misrepresents the underlying work.
- No heading overflow, duplicate CTA intent, excessive kicker cadence, or misleading fallback imagery remains.
- Recruiter scan, contact submission, print, reduced motion, and 320px layouts pass the V2 definition of done.

## Milestones

| Milestone | Outcome |
| --- | --- |
| M1 Foundation | Secure login and persistent content model |
| M2 Design proof | Real migrated project rendered in v3 system |
| M3 Public beta | Complete multi-page public experience |
| M4 CMS beta | Owner can manage all content |
| M5 Release candidate | Analytics, SEO, a11y, performance, and security pass |
| M6 Production | Deployed, monitored, backed up, and documented |

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Generated mockups contain fictional facts | High | Treat templates as layout only; publish verified Laravel/repository data |
| Existing worktree has unrelated edits | High | Inspect before every slice; never overwrite unrelated files |
| Custom motion harms mobile performance | High | Client islands, reduced motion, transform/opacity only, measure INP |
| Admin route appears protected but action is not | High | Authorization in DAL and every mutation boundary |
| Media storage choice changes | Medium | Storage adapter and database-owned metadata |
| Analytics stores personal data | High | No raw IP, rotating hash, retention and opt-out |
| Supabase policy mismatch | Medium | Test RLS with anonymous, owner, and service-role clients |
| Scope grows into a page builder | Medium | Fixed section types and explicit non-goals |

## Definition of done

- All routes and owner workflows satisfy the product spec.
- All checklist items in `tasks/todo.md` are complete.
- No critical or high accessibility/security issues remain.
- Required commands pass from a clean install.
- Production database backup and rollback have been tested.
- Documentation and ADR status match the shipped implementation.
- The portfolio revival acceptance criteria in `docs/portfolio-ux-audit.md` are met.
