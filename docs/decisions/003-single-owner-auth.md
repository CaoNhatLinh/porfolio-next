# ADR-003: Supabase single-owner authentication

## Status

Accepted

## Date

2026-08-29

## Decision

Use Supabase Auth with email/password, database-backed sessions, public sign-up disabled, and one owner account created in the Supabase dashboard or a protected seed script.

## Rationale

Supabase Auth reduces session and cookie risk while integrating with Row Level Security. Disabling registration makes the authorization model intentionally small.

## Consequences

Every protected data access still verifies the server session. The admin email and recovery process must be confirmed before launch.
