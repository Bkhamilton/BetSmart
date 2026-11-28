# Issue #52 — User data, authentication and offline sync

This directory contains the cloud schema and sync contracts for betting
history. Changes in this repository do not deploy migrations automatically.
The new tables are intentionally prefixed `bs_` to avoid overwriting BetSmart's
existing Supabase sportsbook/reference tables. The live Supabase project has **not**
been changed merely by committing these files.

## Architecture

- **Supabase Auth** is the identity authority. Never copy passwords to the
  `bs_profiles` table or authenticate against the local SQLite `Users` table.
- **Supabase Postgres** is the authoritative durable user history.
- **Local SQLite** is the offline working copy and analytics query engine.
  Offline edits are captured in a durable per-account outbox and synchronized
  separately from the local save.
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
3. Review each migration in version order and reconcile the hosted migration
   history first. Phase 1 has already been applied to the primary project:
   **do not rerun it**. Review and apply the remaining additive migrations to
   staging first; use a dry run before any CLI push. If SQL Editor is used,
   record each applied migration and reconcile migration history before
   future CLI deployment.
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
  **not** interchangeable with them; Phase 3 adds stable UUIDs to betting
  records while retaining local integer keys.
- `updated_at`, `revision`, and soft-delete `deleted_at` support incremental
  sync. Stale revisions are conflicts, not last-write-wins updates.
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

## Remaining work and validation

- [x] Replace local plaintext-credential login and `UserSessions` with
  Supabase Auth and secure session storage (Phase 2 code).
- [ ] Complete real-device validation of session persistence, logout/login,
  offline startup, account switching, and local account isolation.
- [ ] Establish mapping from legacy SQLite users to newly verified Auth IDs;
  do **not** migrate a local account solely on a matching unverified email.
- [x] Add stable local cloud UUIDs, a per-account SQLite outbox/cursor, atomic
  write triggers, retry metadata, and the authenticated revision-checked
  Supabase mutation and ordered change-feed contract (Phase 3).
- [x] Add an atomic server-side batch contract for ordered history operations.
  The caller must supply all necessary changes in dependency order and retry
  each with its original operation ID, revision, and payload. The contract
  does not discover aggregate members or wire the mobile client.
- [ ] Validate betting-history upload and restore using real authenticated
  users and native devices, including offline restart, retry, conflicts,
  deletion and account switching.
- [ ] Handle sign-out, per-account local isolation, account export and purge,
  including soft-deleted rows and unresolved uploads.
- [ ] Add integration tests for duplicate retries, offline changes, 2-user RLS,
  cross-device sync, reinstalls, deletions, and legacy-data migration.
- [ ] Sync transactions, balances, sportsbook associations and preferences
  separately in Phase 5; betting-history sync does not restore them.

See [PHASE_3_MAPPING.md](./PHASE_3_MAPPING.md) for field-level mappings,
settlement constraints, and the RPC/cursor contract.
All migrations after Phase 1 must be reviewed and applied in order before
using this client against a hosted project; this change does not apply them.
Existing local betting records are assumed to be in USD, as confirmed by the
project owner. The client must use that assumption explicitly when mapping
them; no existing amounts are converted.

To exercise the batch contract, run `scripts/test-phase4-sync-batch.sql` with
`psql -v ON_ERROR_STOP=1` against a disposable PostgreSQL database named
`betsmart_phase4_test`, after applying the first three migrations. The local fixture
must provide the Supabase `anon` and `authenticated` roles, an `auth.users`
table, and an `auth.uid()` implementation based on `request.jwt.claim.sub`.
The test uses synthetic accounts and rolls back its data.

The later hierarchy contract requires aggregate and ownership markers, so the
older batch fixture must run before that migration. With all migrations
applied, `scripts/test-phase4-hierarchy-contract.sql` tests the final write
contract on `betsmart_phase4_test`. The
`scripts/test-phase4-history-page.sql` fixture uses a separate disposable
database named `betsmart_phase4_history_test`, with the page migration applied
in version order. `scripts/test-phase4-end-to-end.mjs` requires
`PGDATABASE=betsmart_phase4_test` and connects to an explicitly configured
local PostgreSQL instance; set `PGHOST`, `PGPORT`, `PGUSER` and optionally
`PSQL`. It creates and removes synthetic users and local SQLite devices.
Never point these tests at a hosted or shared production database.

The PostgreSQL contract and SQLite integration tests use synthetic users. They
do not replace real Supabase Auth, real-device, or hosted-project validation.
Exclusive SQLite transactions used by history sync are not supported on Expo
web; do not rely on web for history restoration.
Conflicting edits and older attempted queue entries whose original payload
cannot be reconstructed are retained and reported as failed, not overwritten.
They require reconciliation; retry alone cannot resolve a genuine conflict.
An aggregate exceeding the 500-operation server limit is also blocked.

## Why sync remains phased

Authentication, local history preservation, and cloud synchronization have
separate implementation and live-validation gates. Device validation, hosted
deployment, Phase 5 entities, and the release blockers in #52 remain necessary
before claiming complete account recovery.

Tracking: #52
