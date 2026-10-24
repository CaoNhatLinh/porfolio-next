# Single-owner CMS completion

## Objective
Let Cao Nhật Linh maintain portfolio content without editing source files. Vietnamese admin UI; bilingual public content. Supabase remains the only persistent store. No authentication bypass or fake successful writes when configuration is missing.

## Acceptance contract
- Articles/projects: create/edit, preview, publish/unpublish, archive/restore, delete archived records only with explicit confirmation, search/status filters/pagination, visible mutation errors.
- Resume entries: experience, skill groups, education, certifications, services; bilingual fields, tools, dates/current job, logo, evidence URL, order, draft/published/archive. Published entries power Resume/About/Hire.
- Media: image/PDF upload with MIME/signature/size validation, select/copy URLs, alt-text editing; CV selection uses an owned uploaded PDF. Current CV cannot be deleted.
- Editor: Markdown toolbar/live preview/images; structured repeatable project/social fields rather than mandatory raw JSON; unsaved-change guard; pending submission lock.
- Messages: pagination/status/search, read/replied/archive/restore, mailto reply. Mark replied does not itself send email.
- Operations: configuration health, migration check, seed missing current source content without overwriting edits, audit history and JSON content export.

## Implementation slices
1. Resume schema/validation/migration -> admin CRUD -> public consumers.
2. Shared content lifecycle/list controls -> article/project actions and lists.
3. Media validation/upload -> media library -> CV selection.
4. Editor ergonomics, messages, settings, audit/export, onboarding.
5. Unit/security/browser tests, typecheck/lint/build, operator guide.

## Structure / commands
`app/admin/`, `app/components/admin/`, `app/features/content/`, `app/lib/media/`; `supabase/migrations/0008*`; tests under `tests/`; docs under `docs/`.
Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e`.

## Style and boundaries
Use existing `ActionResult`, Zod boundary validation, owner-scoped server actions and service-role Supabase client. Example: `if (error) throw new Error("Unable to save entry.");` Never silently convert DB errors to empty successful lists. No new dependencies needed. Additive migration only; never apply remote migrations or seed unknown production data without configuration/authority. Do not fabricate credentials, experience or certificates.

## Verification limits
Remote persistence/storage/auth acceptance requires a configured Supabase project and admin user. Without credentials, test contracts and mocked storage/actions; verify unauthenticated browser routes stay protected. Do not claim remote end-to-end success.
