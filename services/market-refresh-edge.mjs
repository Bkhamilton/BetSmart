import { refreshAllBettingMarkets } from './market-refresh.mjs';

function equalSecrets(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const token = Deno.env.get('MARKET_REFRESH_TOKEN');
  if (!token) {
    console.error('Missing MARKET_REFRESH_TOKEN');
    return new Response('Service not configured', { status: 500 });
  }
  if (!equalSecrets(request.headers.get('x-market-refresh-token') ?? '', token)) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const result = await refreshAllBettingMarkets({
      supabaseUrl: Deno.env.get('SUPABASE_URL'),
      supabaseServiceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      oddsApiKey: Deno.env.get('THE_ODDS_API_KEY'),
    });
    return Response.json(result);
  } catch (error) {
    console.error('Market refresh failed:', error.message);
    return new Response('Market refresh failed; check function logs', { status: 500 });
  }
});
