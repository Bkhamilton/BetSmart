const LEAGUES = {
  NBA: 'basketball_nba',
  NFL: 'americanfootball_nfl',
  MLB: 'baseball_mlb',
  NHL: 'icehockey_nhl',
};

const BOOKIES = {
  draftkings: 'DraftKings',
  fanduel: 'FanDuel',
  betmgm: 'BetMGM',
  williamhill_us: 'Caesars',
};

const MARKET_TYPES = { h2h: 'moneyline', spreads: 'spread', totals: 'totals' };

function required(value, name) {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function one(rows, description) {
  if (!Array.isArray(rows) || rows.length !== 1) {
    throw new Error(`Expected one ${description}, found ${Array.isArray(rows) ? rows.length : 'invalid response'}`);
  }
  return rows[0];
}

function utcDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid game timestamp');
  return date.toISOString().slice(0, 10);
}

export async function refreshAllBettingMarkets({
  supabaseUrl,
  supabaseServiceRoleKey,
  oddsApiKey,
  fetchImpl = globalThis.fetch,
  now = new Date(),
}) {
  required(supabaseUrl, 'SUPABASE_URL');
  required(supabaseServiceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY');
  required(oddsApiKey, 'THE_ODDS_API_KEY');
  required(fetchImpl, 'fetch');

  const baseUrl = new URL('/rest/v1/', supabaseUrl);
  const headers = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    'Content-Type': 'application/json',
  };

  async function db(path, { query, method = 'GET', body } = {}) {
    const url = new URL(path, baseUrl);
    if (query) url.search = new URLSearchParams(query).toString();
    let response;
    try {
      response = await fetchImpl(url, {
        method,
        headers,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch {
      throw new Error(`Supabase ${method} ${path} failed (network error)`);
    }
    if (!response.ok) throw new Error(`Supabase ${method} ${path} failed (HTTP ${response.status})`);
    if (response.status === 204) return null;
    return response.json();
  }

  async function selectOne(table, query, description) {
    return one(await db(table, { query }), description);
  }

  async function refreshGame(game, league) {
    if (!game || typeof game.id !== 'string' || !game.id ||
        typeof game.home_team !== 'string' || !game.home_team ||
        typeof game.away_team !== 'string' || !game.away_team ||
        !Array.isArray(game.bookmakers)) {
      throw new Error(`Invalid game data for ${league.leagueName}`);
    }

    const rows = [];
    for (const book of game.bookmakers) {
      if (!Object.hasOwn(BOOKIES, book.key)) continue;
      if (!Array.isArray(book.markets)) throw new Error(`Invalid markets for game ${game.id}`);
      const bookie = await selectOne('Bookies', {
        select: 'id', name: `eq.${BOOKIES[book.key]}`,
      }, `bookmaker ${BOOKIES[book.key]}`);
      for (const market of book.markets) {
        if (!Object.hasOwn(MARKET_TYPES, market.key)) continue;
        const marketType = MARKET_TYPES[market.key];
        if (!market.last_update || Number.isNaN(Date.parse(market.last_update)) ||
            !Array.isArray(market.outcomes) || market.outcomes.length === 0) {
          throw new Error(`Invalid ${market.key} market for game ${game.id}`);
        }
        const expectedNames = market.key === 'totals' ? ['Over', 'Under'] : [game.home_team, game.away_team];
        if (market.outcomes.length !== 2 ||
            expectedNames.some((name) => !market.outcomes.some((outcome) => outcome?.name === name))) {
          throw new Error(`Incomplete ${market.key} market for game ${game.id}`);
        }
        for (const outcome of market.outcomes) {
          if (!outcome || typeof outcome.name !== 'string' ||
              typeof outcome.price !== 'number' || !Number.isFinite(outcome.price) ||
              (market.key !== 'h2h' && (typeof outcome.point !== 'number' || !Number.isFinite(outcome.point))) ||
              (market.key === 'totals' && !['Over', 'Under'].includes(outcome.name)) ||
              (market.key !== 'totals' && ![game.home_team, game.away_team].includes(outcome.name))) {
            throw new Error(`Invalid ${market.key} outcome for game ${game.id}`);
          }
          rows.push({
            gameId: game.id,
            marketType,
            timestamp: market.last_update,
            value: market.key === 'h2h' ? outcome.name : outcome.point,
            odds: outcome.price > 0 ? `+${outcome.price}` : String(outcome.price),
            overUnder: market.key === 'totals' ? outcome.name : '',
            targetName: market.key === 'totals' ? null : outcome.name,
            bookieId: bookie.id,
          });
        }
      }
    }
    if (rows.length === 0) {
      console.log(`No supported markets for game ${game.id}; leaving existing markets unchanged`);
      return 0;
    }

    const date = utcDate(game.commence_time);
    const season = await selectOne('Seasons', {
      select: 'id', leagueId: `eq.${league.id}`, startDate: `lte.${date}`, endDate: `gte.${date}`,
    }, `season for ${league.leagueName} on ${date}`);
    const home = await selectOne('Teams', {
      select: 'id', teamName: `eq.${game.home_team}`, leagueId: `eq.${league.id}`,
    }, `team ${game.home_team}`);
    const away = await selectOne('Teams', {
      select: 'id', teamName: `eq.${game.away_team}`, leagueId: `eq.${league.id}`,
    }, `team ${game.away_team}`);
    const targets = new Map();
    for (const name of [game.home_team, game.away_team]) {
      targets.set(name, (await selectOne('BetTargets', {
        select: 'id', targetName: `eq.${name}`,
      }, `bet target ${name}`)).id);
    }

    const result = await db('rpc/refresh_game_markets', {
      method: 'POST',
      body: {
        p_game: {
          gameId: game.id,
          seasonId: season.id,
          date,
          timestamp: game.commence_time,
          homeTeamId: home.id,
          awayTeamId: away.id,
        },
        p_target_name: `${game.away_team} vs ${game.home_team}`,
        p_markets: rows.map(({ targetName, ...row }) => ({
          ...row,
          betTargetId: targetName === null ? null : targets.get(targetName),
        })),
      },
    });
    if (!Number.isInteger(result) || result !== rows.length) {
      throw new Error(`Unexpected refresh result for game ${game.id}`);
    }
    return result;
  }

  const date = utcDate(now);
  const active = await db('rpc/get_active_leagues', { method: 'POST', body: { p_date: date } });
  if (!Array.isArray(active)) throw new Error('Invalid active leagues response');
  const leagues = active.filter((league) => Object.hasOwn(LEAGUES, league.leagueName));
  const skipped = active.filter((league) => !Object.hasOwn(LEAGUES, league.leagueName));
  if (skipped.length) console.log(`Skipping unsupported active leagues: ${skipped.map((league) => league.leagueName).join(', ')}`);
  let games = 0;
  let markets = 0;
  for (const league of leagues) {
    const url = new URL(`https://api.the-odds-api.com/v4/sports/${LEAGUES[league.leagueName]}/odds/`);
    url.search = new URLSearchParams({
      apiKey: oddsApiKey, regions: 'us', markets: 'h2h,spreads,totals', oddsFormat: 'american',
    }).toString();
    let response;
    try {
      response = await fetchImpl(url);
    } catch {
      throw new Error(`Odds API request for ${league.leagueName} failed (network error)`);
    }
    if (!response.ok) throw new Error(`Odds API request for ${league.leagueName} failed (HTTP ${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error(`Invalid Odds API response for ${league.leagueName}`);
    console.log(`Fetched ${league.leagueName}: ${data.length} games; quota remaining: ${response.headers.get('x-requests-remaining') ?? 'unknown'}`);
    for (const game of data) {
      markets += await refreshGame(game, league);
      games += 1;
    }
  }
  return { leagues: leagues.length, games, markets };
}

if (typeof Deno === 'undefined' && typeof process !== 'undefined' && process.argv[1]) {
  const { pathToFileURL } = await import('node:url');
  if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
      const result = await refreshAllBettingMarkets({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        oddsApiKey: process.env.THE_ODDS_API_KEY,
      });
      console.log('Market refresh completed:', result);
    } catch (error) {
      console.error('Market refresh failed:', error.message);
      process.exitCode = 1;
    }
  }
}
