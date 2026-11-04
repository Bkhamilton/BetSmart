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

Use Node.js 24 LTS (`nvm use` reads `.nvmrc`) and npm.

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

### Checks

```sh
npm run doctor
npm run typecheck
npm test -- --runInBand
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
