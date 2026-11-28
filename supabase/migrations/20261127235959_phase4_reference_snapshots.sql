-- Historical descriptions belong to the bet, not mutable reference rows.
ALTER TABLE public.bs_bet_slips
  ADD COLUMN IF NOT EXISTS bookie_display_name_snapshot text;

ALTER TABLE public.bs_participant_bets
  ADD COLUMN IF NOT EXISTS game_date_snapshot text,
  ADD COLUMN IF NOT EXISTS league_snapshot text,
  ADD COLUMN IF NOT EXISTS home_team_abbreviation_snapshot text,
  ADD COLUMN IF NOT EXISTS away_team_abbreviation_snapshot text;

ALTER TABLE public.bs_bet_legs
  ADD COLUMN IF NOT EXISTS bet_type_snapshot text;
