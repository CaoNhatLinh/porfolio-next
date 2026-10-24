# ADR-001: Next.js modular monolith

## Status

Accepted

## Date

2026-08-29

## Context

The portfolio needs public rendering, a private CMS, uploads, forms, and analytics. A separate frontend and API would add deployment and authorization overhead for one owner.

## Decision

Use one Next.js App Router application organized by vertical features. Server Components handle reads, Server Actions handle authenticated CMS mutations, and Route Handlers serve external HTTP boundaries.

## Alternatives

- Keep Laravel as API: preserves legacy code but duplicates deployment and data contracts.
- Headless CMS: faster editing setup but weaker custom admin and analytics integration.
- Separate Node API: useful at team scale, unnecessary here.

## Consequences

One deployment and one authorization boundary. Feature modules and DTOs are required to prevent UI, database, and auth concerns from coupling.
