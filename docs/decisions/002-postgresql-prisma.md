# ADR-002: Supabase platform

## Status

Accepted

## Date

2026-08-29

## Decision

Use Supabase for managed PostgreSQL, Auth, and Storage, deployed with the Next.js application on Vercel.

## Rationale

Portfolio content is relational, ordering and publication require transactions, analytics needs indexed aggregation, and the project needs Auth and media storage in addition to the database. Supabase provides these capabilities with a clear browser-safe client and server-only service role.

## Alternatives

- SQLite: simple locally but not a production source of truth on Vercel.
- JSON files: easy for public pages but cannot safely power CMS and analytics.
- Separate database, auth, and storage vendors: more integration and operational overhead.

## Consequences

Supabase Row Level Security is part of the defense in depth. The service-role key is server-only and never sent to the browser. Storage buckets, SQL migrations, and Auth settings must be versioned or documented alongside the application.

