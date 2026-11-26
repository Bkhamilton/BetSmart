# Phase 3 local-to-cloud mapping

The local integer primary keys remain unchanged. `cloudId` is a stable UUID
for bet slips, participant bets, and legs; local parent keys are resolved to
the corresponding parent `cloudId` when the Phase 4 transport serializes an
aggregate. SQLite triggers capture every insert, update, and delete, including
settlement-result rows, in the same transaction as the local write.

## Betting history

| SQLite source | Supabase destination | Mapping and constraints |
| --- | --- | --- |
| `BetSlips.cloudId` | `bs_bet_slips.id` | Stable UUID generated on-device. Never use SQLite `id` as the cloud ID. |
| `BetSlips.userId` | `bs_bet_slips.user_id` | Resolve through `Users.cloudUserId`; do not infer identity from local email or username. |
| `BetSlips.formatId` | `bet_format` and `legacy_format_id` | `BetFormats.formatName` supplies the display format; preserve the local integer separately. |
| `BetSlips.date` | `placed_at` | Preserve the stored ISO/text timestamp; do not convert it to a date-only value. |
| `BetSlips.odds` | `odds_snapshot` and `decimal_odds` | Preserve the original odds string. Populate decimal odds only when conversion is validated. |
| `BetSlips.betAmount` | `stake` | Preserve the local amount; SQLite stores it as `REAL`, so it is not an exact decimal source. |
| `BetSlips.winnings` | `payout` | Preserve as the app's recorded gross return. Do not infer a payout for an unsettled bet. |
| `BetSlips.bookieId` | `legacy_bookie_id` | Keep as a legacy reference. Populate `user_bookie_id` only after a stable user-bookie mapping exists. |
| `BetSlipsResults.result` | `status` and `legacy_result` | Existing settled values are `1` (won), `0` (lost), and `-1` (push). Preserve the source value; do not translate unknown values. |
| `BetSlipsResults.timestamp` | `settled_at` and `legacy_result_at` | Preserve the settlement timestamp when present. |
| `ParticipantBets.cloudId` | `bs_participant_bets.id` | Stable UUID; map `betSlipId` to the parent's cloud UUID. |
| `ParticipantBets.gameId` | `game_reference_id` | Preserve the provider/reference string, not a local game integer. |
| `ParticipantBets.odds` | `odds_snapshot` and `decimal_odds` | Preserve the original odds string and convert only when valid. |
| `ParticipantBets.*Snapshot` | `sport_snapshot`, `home_team_snapshot`, `away_team_snapshot` | New local writes snapshot these values. Older rows may have null snapshots; never claim current game metadata is historical truth. |
| `ParticipantBetsResults.result/timestamp` | participant `status`, `legacy_result`, `legacy_result_at` | Result rows remain local SQLite records; serialize their state into the parent cloud row. |
| `Legs.cloudId` | `bs_bet_legs.id` | Stable UUID; map `participantBetId` to the participant's cloud UUID. |
| `Legs.betMarketId` | `legacy_market_id` | Preserve the old integer reference, not as a cloud UUID. |
| `Legs.betTypeId` | `legacy_bet_type_id` and `bet_type_snapshot` | Preserve both the integer reference and the current display label snapshot. |
| `Legs.*Snapshot` | leg snapshot columns | New local writes retain market type/value, odds, over/under, target, and bookie reference. Legacy rows may lack a trustworthy historical snapshot. |
| `LegsResults.result/timestamp` | leg `status`, `legacy_result`, `legacy_result_at` | Serialize with the parent leg; there is no separate cloud result table. |

`bs_bet_slips.currency_code` currently defaults to USD, while local betting
records do not store a currency. Confirm the currency assumption before the
Phase 4 uploader relies on that default. Local `REAL` amounts also cannot
recover decimal precision that was already lost before this migration.

## Durable local queue and ownership

`sync_outbox` records a UUID operation ID, local owner ID, entity/action,
entity UUID, local payload, expected server revision, attempts, retry timing,
last error, and acknowledgement state. `sequence` preserves enqueue order.
The pending queue is always queried by the specific local account; a sign-out
does not move, discard, or expose another account's operations.

Local mutations and their trigger-generated queue entries commit or roll back
together. Only one unacknowledged operation per entity is claimable at once.
An acknowledgement stores the returned revision and advances later queued
operations for that entity. Stable operation IDs make replay safe after a lost
response; stale `in_flight` operations become claimable after five minutes.
The pull cursor and timestamps are stored per local account in
`user_sync_state`.

## Supabase write and pull contract

- `bs_apply_sync_change(operation_id, entity_type, entity_id, action,
  expected_revision, payload)` is callable only by an authenticated user.
  It accepts `bet_slip`, `participant_bet`, and `bet_leg` entities; checks
  `auth.uid()` ownership; applies inserts/updates with server-owned revisions;
  soft-deletes records; and returns the same response for an identical
  operation replay. Reusing an operation ID with a different request is an
  error. A stale revision raises a conflict; callers must not overwrite it.
- Direct client inserts, updates, and deletes on those three tables are
  revoked. Parent ownership remains enforced by RLS and composite foreign
  keys.
- `bs_get_sync_changes(after, limit)` returns only the authenticated user's
  changes and tombstones. A per-user transaction advisory lock serializes
  change-log ID allocation with commit, so a client can persist the last
  returned ID as a cursor without skipping a concurrently committed lower ID.
  The cursor is returned as text to avoid JavaScript integer precision loss.
- The mobile client does not call either RPC yet. Phase 4 will map local
  outbox payloads to the cloud shape, upload an aggregate in dependency order,
  apply the feed without generating upload feedback, and restore on a second
  device.

## Deliberate follow-ups

- SQLite has no local representation for cash-out or partial settlement.
  Cloud status values exist, but those statuses must not be inferred from the
  existing three-valued result rows.
- Transactions, sportsbook associations, bankroll/preferences, and remaining
  private records are Phase 5 work. Their legacy representations need a
  separate lossless mapping before they are synchronized.
- No migration is automatically applied to the hosted Supabase project.
  Review and record the additive SQL migration before deployment.
