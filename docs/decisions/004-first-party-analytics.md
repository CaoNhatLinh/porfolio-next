# ADR-004: First-party privacy-conscious analytics

## Status

Accepted

## Date

2026-08-29

## Decision

Capture minimal first-party page-view events, roll them into daily aggregates, avoid raw IP storage, and expire raw events after 90 days.

## Alternatives

- Vercel Analytics: low effort but does not guarantee the custom admin data contract.
- PostHog: powerful but excessive for the required metrics and adds a third-party data processor.
- No analytics: fails the admin reporting requirement.

## Consequences

The app owns ingestion quality, bot filtering, retention, aggregation, and privacy documentation.
