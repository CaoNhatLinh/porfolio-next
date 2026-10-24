# Portfolio implementation documents

This directory is the source of truth for the multi-page portfolio rebuild.

## Read in this order

1. [Product specification](./product-spec.md)
2. [Architecture](./architecture.md)
3. [Design system](./design-system.md)
4. [Content model and Laravel migration](./content-model-and-migration.md)
5. [API and interface contracts](./api-contracts.md)
6. [Security, admin, and analytics](./security-admin-analytics.md)
7. [Dependencies and commands](./dependencies.md)
8. [Deployment runbook](./deployment.md)
9. [Roadmap](../tasks/plan.md)
10. [Execution checklist](../tasks/todo.md)

Architectural decisions live in [`docs/decisions`](./decisions/README.md). The hosting, Supabase, single-owner Auth, and first-party analytics decisions are now `Accepted`.

## Current assumptions

- Deployment target: Vercel.
- Runtime: Node.js 22, matching the current workstation.
- Database and storage: Supabase.
- Authentication: Supabase Auth with one private owner account, no public registration.
- Content source: existing Laravel Blade content and project media.
- Language: Vietnamese and English only, with localized content fields.
- Email: contact messages send notification email through Resend.
- Analytics: first-party, privacy-conscious visit statistics shown only in admin.

Changing hosting, database, authentication, or bilingual requirements requires updating the related ADR before implementation.
