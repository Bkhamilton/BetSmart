-- Issue #52: private account data. This migration intentionally does not alter
-- existing sportsbook-reference tables or migrate the existing SQLite users.
-- Apply to a STAGING Supabase project first. Requires Supabase Auth.
create extension if not exists pgcrypto;

create table public.bs_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revision bigint not null default 1
);
create unique index bs_profiles_username_unique on public.bs_profiles (lower(username)) where username is not null;

create table public.bs_user_bookies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Legacy SQLite bookie IDs are for migration/reference only. Do not treat them
  -- as globally stable IDs until the reference-table mapping is audited.
  reference_bookie_id bigint,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision bigint not null default 1,
  unique (id, user_id)
);
create index bs_user_bookies_owner_updated on public.bs_user_bookies(user_id, updated_at, id);

create table public.bs_bet_slips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_bookie_id uuid,
  -- Snapshot odds and stake at time of placement; never recalculate from
  -- changing provider odds. Monetary figures are in the user's currency.
  stake numeric(14,2) not null check (stake >= 0),
  decimal_odds numeric(14,6) check (decimal_odds > 1),
  currency_code text not null default 'USD' check (currency_code ~ '^[A-Z]{3}$'),
  bet_format text,
  status text not null default 'pending' check (status in ('pending','won','lost','void','push','cashed_out','partial')),
  payout numeric(14,2) check (payout >= 0),
  placed_at timestamptz not null,
  settled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision bigint not null default 1,
  unique (id, user_id),
  foreign key (user_bookie_id, user_id) references public.bs_user_bookies(id, user_id)
);
create index bs_bet_slips_owner_updated on public.bs_bet_slips(user_id, updated_at, id);
create index bs_bet_slips_owner_placed on public.bs_bet_slips(user_id, placed_at desc);

-- Preserve the BetSlips -> ParticipantBets -> Legs hierarchy already used
-- by the SQLite app instead of flattening parlays into one opaque record.
create table public.bs_participant_bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bet_slip_id uuid not null,
  game_reference_id text,
  decimal_odds numeric(14,6) check (decimal_odds > 1),
  status text not null default 'pending' check (status in ('pending','won','lost','void','push','partial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision bigint not null default 1,
  unique (id, user_id),
  foreign key (bet_slip_id, user_id) references public.bs_bet_slips(id, user_id)
);
create index bs_participant_bets_owner_updated on public.bs_participant_bets(user_id, updated_at, id);
create index bs_participant_bets_parent on public.bs_participant_bets(user_id, bet_slip_id);

create table public.bs_bet_legs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  participant_bet_id uuid not null,
  market_reference_id text,
  selection_description text not null,
  odds_at_placement numeric(14,6) check (odds_at_placement > 1),
  line_at_placement numeric(14,4),
  status text not null default 'pending' check (status in ('pending','won','lost','void','push','partial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision bigint not null default 1,
  unique (id, user_id),
  foreign key (participant_bet_id, user_id) references public.bs_participant_bets(id, user_id)
);
create index bs_bet_legs_owner_updated on public.bs_bet_legs(user_id, updated_at, id);
create index bs_bet_legs_parent on public.bs_bet_legs(user_id, participant_bet_id);

create table public.bs_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_bookie_id uuid,
  kind text not null check (kind in ('deposit','withdrawal','adjustment')),
  amount numeric(14,2) not null check (amount >= 0),
  currency_code text not null default 'USD' check (currency_code ~ '^[A-Z]{3}$'),
  occurred_at timestamptz not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision bigint not null default 1,
  unique (id, user_id),
  foreign key (user_bookie_id, user_id) references public.bs_user_bookies(id, user_id)
);
create index bs_transactions_owner_updated on public.bs_transactions(user_id, updated_at, id);

create table public.bs_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bankroll_limit numeric(14,2) check (bankroll_limit >= 0),
  daily_limit numeric(14,2) check (daily_limit >= 0),
  unit_size numeric(14,2) check (unit_size >= 0),
  odds_format text check (odds_format in ('american','decimal','fractional')),
  preferred_leagues text[] not null default '{}',
  preferred_bet_types text[] not null default '{}',
  updated_at timestamptz not null default now(),
  revision bigint not null default 1
);

-- Server owns revision/update timestamps. A client must use a conditional
-- update RPC or compare-and-swap API to avoid lost edits across devices.
create function public.bs_touch_revision()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  new.revision := old.revision + 1;
  return new;
end $$;

create trigger bs_profiles_touch before update on public.bs_profiles
for each row execute function public.bs_touch_revision();
create trigger bs_user_bookies_touch before update on public.bs_user_bookies
for each row execute function public.bs_touch_revision();
create trigger bs_bet_slips_touch before update on public.bs_bet_slips
for each row execute function public.bs_touch_revision();
create trigger bs_participant_bets_touch before update on public.bs_participant_bets
for each row execute function public.bs_touch_revision();
create trigger bs_bet_legs_touch before update on public.bs_bet_legs
for each row execute function public.bs_touch_revision();
create trigger bs_transactions_touch before update on public.bs_transactions
for each row execute function public.bs_touch_revision();
create trigger bs_preferences_touch before update on public.bs_preferences
for each row execute function public.bs_touch_revision();

-- Explicitly enable RLS on every private table. RLS applies to all client
-- CRUD paths; parent ownership is separately guaranteed by composite FKs.
alter table public.bs_profiles enable row level security;
alter table public.bs_user_bookies enable row level security;
alter table public.bs_bet_slips enable row level security;
alter table public.bs_participant_bets enable row level security;
alter table public.bs_bet_legs enable row level security;
alter table public.bs_transactions enable row level security;
alter table public.bs_preferences enable row level security;

-- Do not leave any unrestricted anonymous access to private tables.
revoke all on public.bs_profiles, public.bs_user_bookies,
  public.bs_bet_slips, public.bs_participant_bets, public.bs_bet_legs,
  public.bs_transactions, public.bs_preferences from anon;
grant select, insert, update, delete on public.bs_profiles, public.bs_user_bookies,
  public.bs_bet_slips, public.bs_participant_bets, public.bs_bet_legs,
  public.bs_transactions, public.bs_preferences to authenticated;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'bs_profiles','bs_user_bookies','bs_bet_slips',
    'bs_participant_bets','bs_bet_legs','bs_transactions','bs_preferences'
  ] loop
    execute format('create policy own_select on public.%I for select to authenticated using ((select auth.uid()) = user_id)', tbl);
    execute format('create policy own_insert on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', tbl);
    execute format('create policy own_update on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', tbl);
    execute format('create policy own_delete on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', tbl);
  end loop;
end $$;

-- Deletes for sync should normally be soft deletes (deleted_at), so that
-- offline devices can receive tombstones. Physical deletes are reserved for
-- account deletion/purge workflows after reconciliation.
