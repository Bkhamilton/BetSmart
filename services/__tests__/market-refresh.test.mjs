import { test } from 'node:test';
import assert from 'node:assert/strict';
import { refreshAllBettingMarkets } from '../market-refresh.mjs';

const config = {
  supabaseUrl: 'https://example.supabase.co',
  supabaseServiceRoleKey: 'service-secret',
  oddsApiKey: 'odds-secret',
  now: new Date('2026-11-23T12:00:00Z'),
};

function fixture(active = [{ id: 1, leagueName: 'NBA' }, { id: 2, leagueName: 'WNBA' }]) {
  const calls = [];
  const game = {
    id: 'game-1',
    commence_time: '2026-11-24T01:00:00Z',
    home_team: 'Home',
    away_team: 'Away',
    bookmakers: [
      {
        key: 'draftkings',
        markets: [
          {
            key: 'h2h',
            last_update: '2026-11-23T12:00:00Z',
            outcomes: [{ name: 'Home', price: 110 }, { name: 'Away', price: -130 }],
          },
          {
            key: 'totals',
            last_update: '2026-11-23T12:00:00Z',
            outcomes: [{ name: 'Over', price: -110, point: 215.5 }, { name: 'Under', price: -110, point: 215.5 }],
          },
        ],
      },
    ],
  };
  const fetchImpl = async (url, options = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    calls.push({ url: parsed, options });
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
    if (parsed.hostname === 'api.the-odds-api.com') return json([game]);
    if (path.endsWith('/rpc/get_active_leagues')) return json(active);
    if (path.endsWith('/Leagues')) return json([{ id: 1 }]);
    if (path.endsWith('/Bookies')) return json([{ id: 5 }]);
    if (path.endsWith('/Seasons')) return json([{ id: 6 }]);
    if (path.endsWith('/Teams')) return json([{ id: parsed.searchParams.get('teamName') === 'eq.Home' ? 7 : 8 }]);
    if (path.endsWith('/BetTargets')) return json([{ id: parsed.searchParams.get('targetName') === 'eq.Home' ? 9 : 10 }]);
    if (path.endsWith('/rpc/refresh_game_markets')) return json(JSON.parse(options.body).p_markets.length);
    throw new Error(`Unexpected request: ${path}`);
  };
  return { calls, game, fetchImpl };
}

test('refreshes supported leagues with complete market rows through the atomic RPC', async () => {
  const { calls, fetchImpl } = fixture();
  const result = await refreshAllBettingMarkets({ ...config, fetchImpl });
  assert.deepEqual(result, { leagues: 1, games: 1, markets: 4 });
  const active = calls.find((call) => call.url.pathname.endsWith('/rpc/get_active_leagues'));
  assert.deepEqual(JSON.parse(active.options.body), { p_date: '2026-11-23' });
  const oddsCalls = calls.filter((call) => call.url.hostname === 'api.the-odds-api.com');
  assert.equal(oddsCalls.length, 1);
  assert.equal(oddsCalls[0].url.searchParams.get('markets'), 'h2h,spreads,totals');
  const rpc = calls.find((call) => call.url.pathname.endsWith('/rpc/refresh_game_markets'));
  const body = JSON.parse(rpc.options.body);
  assert.equal(body.p_game.date, '2026-11-24');
  assert.equal(body.p_target_name, 'Away vs Home');
  assert.deepEqual(body.p_markets.map((row) => [row.marketType, row.value, row.odds, row.overUnder, row.betTargetId]), [
    ['moneyline', 'Home', '+110', '', 9],
    ['moneyline', 'Away', '-130', '', 10],
    ['totals', 215.5, '-110', 'Over', null],
    ['totals', 215.5, '-110', 'Under', null],
  ]);
  assert.equal(rpc.options.headers.Authorization, 'Bearer service-secret');
});

test('resolves league IDs when the active-league RPC returns lowercase names without IDs', async () => {
  const { calls, fetchImpl } = fixture([{ leaguename: 'NBA' }, { leaguename: 'WNBA' }]);
  const result = await refreshAllBettingMarkets({ ...config, fetchImpl });
  assert.deepEqual(result, { leagues: 1, games: 1, markets: 4 });
  const lookup = calls.find((call) => call.url.pathname.endsWith('/Leagues'));
  assert.equal(lookup.url.searchParams.get('leagueName'), 'eq.NBA');
  const season = calls.find((call) => call.url.pathname.endsWith('/Seasons'));
  assert.equal(season.url.searchParams.get('leagueId'), 'eq.1');
});

test('rejects malformed or unresolved leagues before consuming provider quota', async () => {
  for (const active of [[{}], [{ leaguename: 'NBA' }]]) {
    const { calls, fetchImpl } = fixture(active);
    await assert.rejects(refreshAllBettingMarkets({
      ...config,
      fetchImpl: (url, options) => new URL(url).pathname.endsWith('/Leagues')
        ? Promise.resolve(new Response('[]'))
        : fetchImpl(url, options),
    }), /Invalid active league name|Expected one league NBA/);
    assert.equal(calls.some((call) => call.url.hostname === 'api.the-odds-api.com'), false);
  }
});

test('sends Supabase secret keys as apikey without a bearer token', async () => {
  const { calls, fetchImpl } = fixture();
  await refreshAllBettingMarkets({ ...config, supabaseServiceRoleKey: 'sb_secret_test', fetchImpl });
  const active = calls.find((call) => call.url.pathname.endsWith('/rpc/get_active_leagues'));
  assert.equal(active.options.headers.apikey, 'sb_secret_test');
  assert.equal(active.options.headers.Authorization, undefined);
});

test('does not replace existing markets when a provider returns incomplete outcomes', async () => {
  const { calls, game, fetchImpl } = fixture();
  game.bookmakers[0].markets[0].outcomes.pop();
  await assert.rejects(refreshAllBettingMarkets({ ...config, fetchImpl }), /Incomplete h2h/);
  assert.equal(calls.some((call) => call.url.pathname.endsWith('/rpc/refresh_game_markets')), false);
});

test('leaves existing markets untouched when no supported bookmaker provides markets', async () => {
  const { calls, game, fetchImpl } = fixture();
  game.bookmakers = [{ key: 'unsupported', markets: [] }];
  const result = await refreshAllBettingMarkets({ ...config, fetchImpl });
  assert.equal(result.markets, 0);
  assert.equal(calls.some((call) => call.url.pathname.endsWith('/rpc/refresh_game_markets')), false);
});

test('stops on provider errors and does not expose credentials in network errors', async () => {
  const { calls, fetchImpl } = fixture();
  await assert.rejects(refreshAllBettingMarkets({
    ...config,
    fetchImpl: async (url, options) => {
      if (new URL(url).hostname === 'api.the-odds-api.com') throw new Error(`failure ${url}`);
      return fetchImpl(url, options);
    },
  }), (error) => !error.message.includes(config.oddsApiKey) && /network error/.test(error.message));
  assert.equal(calls.some((call) => call.url.pathname.endsWith('/rpc/refresh_game_markets')), false);
});

test('fails explicitly when credentials are missing or an atomic update fails', async () => {
  await assert.rejects(refreshAllBettingMarkets({ ...config, oddsApiKey: '' }), /Missing THE_ODDS_API_KEY/);
  const { fetchImpl } = fixture();
  await assert.rejects(refreshAllBettingMarkets({
    ...config,
    fetchImpl: async (url, options) => {
      if (new URL(url).pathname.endsWith('/rpc/refresh_game_markets')) return new Response('', { status: 500 });
      return fetchImpl(url, options);
    },
  }), /refresh_game_markets failed \(HTTP 500\)/);
  await assert.rejects(refreshAllBettingMarkets({
    ...config,
    fetchImpl: async (url, options) => {
      if (new URL(url).pathname.endsWith('/rpc/refresh_game_markets')) return new Response('null');
      return fetchImpl(url, options);
    },
  }), /Unexpected refresh result/);
});

test('edge handler requires its token and runs the same refresh for an authorized POST', async () => {
  let handler;
  let token = 'correct-secret';
  const { fetchImpl } = fixture();
  const originalFetch = globalThis.fetch;
  const env = {
    SUPABASE_URL: config.supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: config.supabaseServiceRoleKey,
    THE_ODDS_API_KEY: config.oddsApiKey,
  };
  globalThis.fetch = fetchImpl;
  globalThis.Deno = {
    env: { get: (name) => name === 'MARKET_REFRESH_TOKEN' ? token : env[name] },
    serve: (callback) => { handler = callback; },
  };
  try {
    await import('../market-refresh-edge.mjs');
    assert.equal((await handler(new Request('https://example.test', { method: 'GET' }))).status, 405);
    assert.equal((await handler(new Request('https://example.test', { method: 'POST' }))).status, 401);
    const authorized = await handler(new Request('https://example.test', {
      method: 'POST', headers: { 'x-market-refresh-token': token },
    }));
    assert.equal(authorized.status, 200);
    assert.deepEqual(await authorized.json(), { leagues: 1, games: 1, markets: 4 });
    token = '';
    assert.equal((await handler(new Request('https://example.test', { method: 'POST' }))).status, 500);
  } finally {
    delete globalThis.Deno;
    globalThis.fetch = originalFetch;
  }
});
