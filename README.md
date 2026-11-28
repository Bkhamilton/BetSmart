# BetSmart

BetSmart is a sports bet tracking app that helps you keep track of your bets and analyze your betting performance. Whether you're a casual bettor or a seasoned pro, BetSmart provides the tools you need to stay organized and make informed betting decisions.

Created by Ben Hamilton

## App Structure

```markdown
app/
├── \_layout.tsx
├── tabs/
│ ├── \_layout.tsx
│ ├── home.tsx
│ ├── insights.tsx
│ ├── newBet/
│ │ ├── \_layout.tsx
│ │ ├── selectGame.tsx
│ │ └── betDetails.tsx
│ ├── data.tsx
│ ├── profile/
│ │ ├── \_layout.tsx
│ │ ├── profilePage.tsx
│ │ └── settings.tsx
```

## Features

- **Bet Tracking**: Easily record your bets, including the sport, event, bet type, stake, and outcome.
- **Statistics**: Get detailed statistics on your betting performance, including win/loss ratio, average stake, and total profit/loss.
- **Graphical Analysis**: Visualize your betting performance over time with interactive charts and graphs.
- **Notifications**: Receive notifications for upcoming events, bet outcomes, and important updates.
- **Customization**: Personalize your BetSmart experience by choosing your preferred theme and layout.

## Development

Use a Node.js version supported by `package.json` (`engines.node`); `.nvmrc`
selects Node.js 26. Use npm for package management.

```sh
npm ci
npm start -- --clear
```

Open the project with an Expo Go version compatible with the installed Expo SDK,
or create a fresh development build. Development builds made for SDK 54 must be
rebuilt after this upgrade. A JavaScript bundle export does not compile or test
the native app.

### Local startup without Supabase

No environment file is required. With the Supabase variables unset, the app
creates its local SQLite schema and starts without remote synchronization.
Existing local betting history is preserved. This is an empty local app, not a
populated demo: leagues, games, markets, and other server-provided reference data
will be unavailable until a working backend is configured.

To reconnect a backend, copy `.env.example` to `.env`, fill in the public URL and
client API key, and restart Expo. Only put publishable/anon client credentials in
`EXPO_PUBLIC_*` variables; they are included in the app bundle.

When connected, the app syncs seasons on startup before checking for game
updates. New and changed seasons update local SQLite without deleting existing
season records or betting history.

### Standalone market refresh

The market refresh runs outside Expo. `services/market-refresh.mjs` is a
self-contained Node.js 18+ script with no npm dependencies; copy it to a
separate project or host if desired. It fetches The Odds API's NBA, NFL, MLB,
and NHL moneylines, spreads, and totals for active leagues and the four
configured bookmakers. It does **not** fetch player props or schedule itself.

Before running it:

1. Apply `services/market-refresh.sql` once using the target Supabase project's SQL
   editor or migrations. It installs a service-role-only function that replaces
   returned game/bookmaker/market combinations in a transaction; markets not
   returned by the provider are left alone. Check this against a test database
   before production, especially if other tables reference market IDs.
2. Provide `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `THE_ODDS_API_KEY` as
   private server-side environment variables. `SUPABASE_SERVICE_ROLE_KEY` must
   contain a Supabase secret key or legacy service-role key, not a publishable
   or anon key. Never put private credentials in `EXPO_PUBLIC_*`,
   commit them, or ship them with the app. A `.env` file is not loaded by plain
   `node`; use `node --env-file=.env` to load a private project-root `.env`
   (supported by Node.js 20.6+ and 18.19+).
3. Run `node services\market-refresh.mjs` on Windows. The process exits nonzero
   on failure. With a `.env` file, run
   `node --env-file=.env services\market-refresh.mjs` instead. It logs the
   provider's remaining quota when available.

The repository's `market-refresh` agent skill guides an authorized one-off run.

For Supabase Edge Functions, copy both `market-refresh-edge.mjs` (as `index.mjs`)
and `market-refresh.mjs` into `supabase/functions/market-refresh` in a Supabase
CLI project. Configure the JavaScript entry point in `supabase/config.toml`:

```toml
[functions.market-refresh]
entrypoint = "./functions/market-refresh/index.mjs"
verify_jwt = false
```

Set
`THE_ODDS_API_KEY` and a long random `MARKET_REFRESH_TOKEN` as function secrets;
Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for hosted
functions. Deploy using `supabase functions deploy market-refresh`. The
function requires the private `x-market-refresh-token` header on every POST
instead of a user JWT. Keep the token in a secure server-side secret store; never call
this endpoint directly from the app. A scheduler must POST to the deployed
function URL with that header. This repository does not configure a schedule.

Each active supported league causes one Odds API request per run. This service
does not enforce a twice-daily limit, prevent overlapping runs, or automatically
retry; configure the scheduler accordingly and monitor logs and provider quota.
Dates used for selecting active seasons and games are UTC. A failure stops the
run; games already completed remain updated, so rerunning may consume additional
provider quota. The refresh replaces market rows and their IDs for returned
combinations, matching the old refresh's approach; check downstream references
and local bet history before deploying it.

### Checks

```sh
npm run doctor
npm run typecheck
npm test -- --runInBand
node --test services\__tests__\market-refresh.test.mjs
npm run test:database
npx expo export --platform android
npx expo export --platform ios
npm run web
```

The database regression check uses Node's built-in SQLite module and checks that
repeated initialization and reopening preserve local users and betting history.

Web uses SQLite's WebAssembly worker. Metro is configured to serve its WASM
asset and the cross-origin isolation headers needed for `SharedArrayBuffer`.
If hosting exported web files elsewhere, serve them with
`Cross-Origin-Embedder-Policy: credentialless` and
`Cross-Origin-Opener-Policy: same-origin` as well.

### Native smoke test

On a phone or simulator, verify a fresh launch without `.env`, navigate through
Home, Insights, Data, and Profile, and relaunch to check local persistence. If
upgrading an existing installation, check its history remains present. Remote
sports-data flows require the restored backend and are outside this startup
upgrade's verification.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

Contributions done by Kenneth Sullivan

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or support, please contact us at benkenhamilvan@gmail.com.
