# Content model and Laravel migration

## Source inventory

Laravel currently provides the real owner identity, profile photo, skills, project copy, repository links, and these media-backed projects:

- Tutor Connect
- Dormitory Management
- Shoes Shop
- FilmWatch
- Zing Music
- Motorcycle Store
- Movie Admin Panel
- Bus Management

Media is located under `E:/WORKSPACE/portfolio/a/public/images`.

The reviewed staging index is [`app/features/content/content.fixture.json`](../app/features/content/content.fixture.json), and copied asset provenance is tracked in [`public/media/manifest.json`](../public/media/manifest.json). The TypeScript fixture remains the runtime-safe fallback for local review.

## Proposed domain models

- `SiteProfile`: name, headline, bio, location, email, availability, response time, engagement modes, resume URL/update date, SEO defaults.
- `SocialLink`: platform, label, URL, sort order, visibility.
- `SkillGroup` and `Skill`: category, proficiency label, sort order.
- `Experience`: organization, role, start/end dates, summary, highlights.
- `Project`: slug, title, excerpt, category, role, duration, team context, year, stack, links, proof links, status, `isFeatured`, `featuredOrder`, `sortOrder`, SEO.
- `ProjectMedia`: project, kind, URL, alt text, dimensions, focal point, sort order.
- `ProjectMetric`: label, value, context, sort order.
- `ProjectSection`: discriminated type, heading, content JSON, sort order.
- `Article`: slug, title, excerpt, body Markdown, topic, reading time, cover media (`cover_url` plus localized alt/caption in the fixture), status, published date, SEO.
- `ContactMessage`: sender details, intent, project brief, timeline, status, timestamps.
- `LabItem`: slug, bilingual title/summary, state, cover, demo/repository links, sort order.
- `MediaAsset`: storage key, URL, MIME type, dimensions, alt text, usage metadata.
- `AnalyticsEvent` and `AnalyticsDaily`: privacy-conscious raw retention and rollups.

## Project section types

`TEXT`, `MEDIA`, `MEDIA_GRID`, `PROBLEM`, `SOLUTION`, `ARCHITECTURE`, `OUTCOMES`, `TECHNICAL_DECISIONS`, `QUOTE`.

Each type has its own Zod schema and renderer. Unknown types fail safely in admin preview and are skipped on public pages with an observable server log.

## Migration process

1. Copy original media into a staging folder without deleting Laravel assets.
2. Extract Blade content into a versioned JSON seed file.
3. Normalize project names, repository URLs, stacks, descriptions, and missing alt text.
4. Mark the strongest 2-3 real projects as featured and assign explicit order.
5. Import database content through an idempotent seed script.
6. Upload approved media to object storage and replace staging URLs.
7. Compare every imported record against the Laravel source.
8. Keep generated v3 mockup content as layout guidance only, never as factual biography or project metrics.
9. Apply `supabase/migrations/0003_portfolio_vitality.sql` before using public Lab, hiring intent, conversion event, or resume metadata fields.

## Content rules

- Never publish generated statistics as real project outcomes.
- Do not infer years, clients, roles, or technologies when Laravel and repositories do not prove them.
- Journal covers must use an approved asset from the portfolio media manifest or an owner-uploaded Supabase Storage asset. Captions explain the artifact's relevance rather than acting as decoration.
- Each published article should include one concrete takeaway, one example grounded in a real project, and a bilingual version before it is marked ready.
- Missing information appears as a draft field in admin.
- Slugs remain stable after publishing. A changed slug requires a redirect record.
