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
| `BetSlips.formatNameSnapshot` | `bet_format` | Preserve the format recorded with the bet, independently of local reference IDs. |
| `BetSlips.date` | `placed_at` | Preserve the stored ISO/text timestamp; do not convert it to a date-only value. |
| `BetSlips.odds` | `odds_snapshot` and `decimal_odds` | Preserve the original odds string. Populate decimal odds only when conversion is validated. |
| `BetSlips.betAmount`, `cloudStake` | `stake` | Local `REAL` amounts cannot recover previously lost precision; restored cloud decimals are also retained as exact text. |
| `BetSlips.winnings`, `cloudPayout` | `payout` | The app records gross return; exact restored cloud decimals are retained as text. |
| `BetSlips.bookieNameSnapshot` | `bookie_display_name_snapshot` | A historical display name is not a synced sportsbook association. |
| `BetSlipsResults.result` | `status` and `legacy_result` | Existing settled values are `1` (won), `0` (lost), and `-1` (push). Preserve the source value; do not translate unknown values. |
| `BetSlipsResults.timestamp` | `settled_at` and `legacy_result_at` | Preserve the settlement timestamp when present. |
| `ParticipantBets.cloudId` | `bs_participant_bets.id` | Stable UUID; map `betSlipId` to the parent's cloud UUID. |
| `ParticipantBets.gameId` | `game_reference_id` | Preserve the provider/reference string, not a local game integer. |
| `ParticipantBets.odds` | `odds_snapshot` and `decimal_odds` | Preserve the original odds string and convert only when valid. |
| `ParticipantBets.*Snapshot` | game, sport, league and team snapshot columns | New local writes snapshot these values. Older rows may have null snapshots; never claim current game metadata is historical truth. |
| `ParticipantBetsResults.result/timestamp` | participant `status`, `legacy_result`, `legacy_result_at` | Result rows remain local SQLite records; serialize their state into the parent cloud row. |
| `Legs.cloudId` | `bs_bet_legs.id` | Stable UUID; map `participantBetId` to the participant's cloud UUID. |
| `Legs.betMarketId` | `legacy_market_id` | A device-local reference; it must not be interpreted as a valid reference on another device. |
| `Legs.betTypeSnapshot` | `bet_type_snapshot` | Preserve the label independently of the device-local integer reference. |
| `Legs.*Snapshot` | leg snapshot columns | New local writes retain market type/value, odds, over/under, target, and bookie reference. Legacy rows may lack a trustworthy historical snapshot. |
| `LegsResults.result/timestamp` | leg `status`, `legacy_result`, `legacy_result_at` | Serialize with the parent leg; there is no separate cloud result table. |

Existing local betting records are assumed to be USD, as confirmed by the
project owner. A restored cloud record retains its currency instead of being
converted. Local `REAL` amounts cannot recover precision already lost.

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
- Phase 4 adds batch upload and a page RPC that returns account-owned record
  snapshots with the feed. Remote changes are applied with local outbox
  triggers suppressed. Device and hosted-project verification remain separate
  deployment gates.

## Deliberate follow-ups

- SQLite has no local representation for cash-out or partial settlement.
  Cloud status values exist, but those statuses must not be inferred from the
  existing three-valued result rows.
- Transactions, sportsbook associations, bankroll/preferences, and remaining
  private records are Phase 5 work. Their legacy representations need a
  separate lossless mapping before they are synchronized.
- No migration is automatically applied to the hosted Supabase project.
  Review and record the additive SQL migration before deployment.
