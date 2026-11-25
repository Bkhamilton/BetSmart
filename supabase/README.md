# Issue #52 — User data, authentication and offline sync

This directory begins the **cloud schema foundation**, not a completed sync feature.
The new tables are intentionally prefixed `bs_` to avoid overwriting BetSmart's
existing Supabase sportsbook/reference tables. The live Supabase project has **not**
been changed merely by committing these files.

## Architecture

- **Supabase Auth** is the identity authority. Never copy passwords to the
  `bs_profiles` table or authenticate against the local SQLite `Users` table.
- **Supabase Postgres** is the authoritative durable user history.
- **Local SQLite** is the offline working copy and analytics query engine.
  Offline edits will eventually be uploaded via a durable outbox.
- **Shared sportsbook reference data** (teams, games, markets, odds) remains
  separate from private user-generated records.
- `bs_bet_slips -> bs_participant_bets -> bs_bet_legs` follows the existing
  SQLite hierarchy. Odds, wager details, and selections are snapshots:
  historical bets must not change when the sportsbook API changes.

## Review before applying the schema

1. Inspect the existing hosted Supabase schema, migration history, table names,
   and project environment. Baseline any pre-existing remote schema before
   introducing migrations (e.g. use the Supabase CLI's `db pull` workflow).
   Do not blindly push into the production project.
2. Link a **staging** project with `npx supabase login` and
   `npx supabase link --project-ref <staging-project-ref>`.
3. Review `supabase/migrations/20261123000000_create_betsmart_user_data.sql`.
   Apply to staging with `npx supabase db push --dry-run`, then
   `npx supabase db push`, after reconciling migration history. Local CLI
   version/flags should be confirmed before applying.
4. Confirm RLS with two real Supabase Auth test users: each user can create
   and read their own rows, cannot read/update/delete the other's rows, and
   cannot attach a bet leg to a different user's parent bet. Also test
   anonymous access and DELETE behavior.
5. Validate query indexes, backups, and rollback plan before production.
   PostgreSQL migrations are not automatically reverted by closing a PR.

## Schema notes

- Every private table has `user_id` and per-user RLS policies. Composite
  foreign keys ensure child records cannot point to another user's parent.
- UUIDs are cloud stable identifiers. Current SQLite auto-increment IDs are
  **not** interchangeable with them; migration needs a persistent ID mapping.
- `updated_at`, `revision`, and soft-delete `deleted_at` support future
  incremental sync. This migration alone does **not** provide lost-update
  protection: implement conditional write/version checks before multi-device
  writes are enabled. A client should not overwrite a stale server revision.
- `bs_transactions` tracks money movements only; bankroll balance should be
  derived from a consistent ledger/history rather than trusted as independently
  synced state.
- Betting statuses, odds format, and cash-out rules need verification against
  the actual legacy SQLite schema and UI before the migration is used for
  existing users. Do not infer a payout for unsettled bets.
- Existing database references such as `bookieId`, `gameId`, and
  `betMarketId` need an explicit mapping strategy; the schema currently
  keeps legacy reference values as strings/integers rather than unsafe FKs
  into a partially audited shared schema.
- Never put the Supabase service-role key in an Expo `EXPO_PUBLIC_` variable.
  Use the publishable/anon key with RLS for mobile clients.

## Follow-up implementation checklist (not implemented by this PR)

- [ ] Replace local plaintext-credential login in `hooks/useAuthState.js`
  and local `UserSessions` with Supabase Auth; choose secure session storage.
  The existing SQLite `Users` implementation currently compares and writes
  password values directly, so this is a launch-blocking audit.
- [ ] Establish mapping from legacy SQLite users to newly verified Auth IDs;
  do **not** migrate a local account solely on a matching unverified email.
- [ ] Add `cloud_id` (UUID) to local user tables without losing integer
  primary keys or existing parent-child associations.
- [ ] Add an SQLite `sync_outbox` and make user mutations + outbox writes
  atomic. Use stable operation IDs and idempotent server writes.
- [ ] Implement full initial upload, incremental download with a safe cursor,
  tombstone propagation, retries and reconnect/foreground synchronization.
- [ ] Implement conditional server writes (expected revision / CAS or RPC)
  and conflict handling for simultaneous edits on different devices.
- [ ] Handle sign-out, per-account local isolation, account export and purge,
  including soft-deleted rows and unresolved uploads.
- [ ] Add integration tests for duplicate retries, offline changes, 2-user RLS,
  cross-device sync, reinstalls, deletions, and legacy-data migration.
- [ ] Wire Data, Insights and Home to stable synced records and add a
  `pending / synced / failed` status that distinguishes local saves from
  durable cloud confirmation.

## Why this is a phased PR

Changing Auth and syncing every write path in the same change as deploying a
new Postgres schema could permanently orphan existing local users' history.
This PR isolates the reversible first step (a reviewable **additive schema**)
from the later app migration. **Do not merge/deploy assuming synchronization or
cloud account recovery works yet.**

Tracking: #52
