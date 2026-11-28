---
name: market-refresh
description: Run BetSmart's standalone market refresh against an explicitly confirmed Supabase project.
---

# Run the market refresh

Use this skill when asked to run the existing standalone market refresh. It
fetches moneylines, spreads, and totals for supported active leagues; it does
not fetch player props or configure a schedule.

1. Read `README.md` under "Standalone market refresh" and check
   `services/market-refresh.mjs` for current requirements and behavior.
2. Before running, confirm the intended Supabase project and that the user
   authorizes a live refresh if they have not already done so. The refresh
   consumes Odds API quota and replaces market rows and IDs; verify the user
   understands the impact on downstream references, especially in production.
   Never assume the linked Supabase CLI project is the runner's target.
3. Confirm a compatible Node.js version (Node.js 18 or later) and the three
   private environment variables `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `THE_ODDS_API_KEY` are available to the
   process. Confirm only presence and the URL hostname, never print or request
   secret values in chat. Match the hostname to the confirmed project before
   proceeding. If credentials are unavailable, ask the user to configure them
   securely and stop; never search for or expose credentials.
   Node does not automatically load `.env`; use Node's `--env-file` option for
   a trusted private env file (available in Node.js 20.6+ and 18.19+). Check the
   same source that will be used for the actual run.
4. Ensure the target database has the required `get_active_leagues` and
   `refresh_game_markets` RPCs and the expected reference data. Do not apply
   `services/market-refresh.sql` or other migrations without explicit
   authorization and a staging/schema review. If readiness is unknown, stop
   and ask rather than making database changes.
5. From the repository root, run one refresh:

   ```powershell
   node services\market-refresh.mjs
   ```

   With a private project-root `.env` file, use
   `node --env-file=.env services\market-refresh.mjs`. For another trusted
   private env-file path, use
   `node --env-file=<private-env-file> services\market-refresh.mjs` instead.
   Do not include secrets in command arguments. Do not run both forms or
   automatically retry: a failed run may already have updated some games and
   another run consumes additional quota.
6. Report the exit status, league/game/market counts and remaining quota if
   logged. On failure, report the error and possible partial updates; do not
   claim success. Never include credentials in the report.

The script runs once and exits. This skill does not schedule future runs or
deploy an Edge Function.
