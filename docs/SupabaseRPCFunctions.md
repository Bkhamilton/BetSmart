# Supabase RPC Functions Documentation

This document catalogs all Supabase Remote Procedure Call (RPC) functions used in the BetSmart application. These Edge Functions were used to optimize database queries by performing complex joins and filtering on the server side. If your Supabase project was paused and the Edge Functions were deleted, use this document to understand each function's purpose and determine whether to recreate them.

## Overview

All RPC functions in this document are called using the Supabase client's `.rpc()` method. These functions typically perform complex SQL queries that join multiple tables and filter data based on specific criteria.

---

## 1. get_upcoming_games

### Purpose
Retrieves all upcoming games (games scheduled for today or later) for a specific season, including team names and abbreviations.

### Location
- **File**: `api/supabase/Games.js`
- **Function**: `getUpcomingGames(supabase, seasonId)`
- **Line**: 21

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `input_season_id` | integer | The ID of the season to retrieve games for |

### Expected Output
Returns an array of game objects with the following structure:
```javascript
[
  {
    id: integer,              // Database primary key
    gameId: string,           // Unique game identifier
    seasonId: integer,        // Season ID (FK to Seasons table)
    date: string,             // Game date (YYYY-MM-DD)
    timestamp: string,        // Full game timestamp (ISO 8601)
    homeTeamName: string,     // Home team name
    homeTeamAbv: string,      // Home team abbreviation
    awayTeamName: string,     // Away team name
    awayTeamAbv: string       // Away team abbreviation
  },
  // ... more games
]
```

### SQL Logic
The function should perform the following operations:
1. Join `Games` table with `Teams` table twice (for home and away teams)
2. Filter for games where `date >= CURRENT_DATE`
3. Filter by the provided `seasonId`
4. Select game details along with team names and abbreviations
5. Order by date (ascending)

### Local Database Equivalent
See `db/general/Games.js` - `getUpcomingGames(db, seasonId)` lines 110-140

---

## 2. get_games_by_date_and_season

### Purpose
Retrieves all games for a specific date and season, including team information.

### Location
- **File**: `api/supabase/Games.js`
- **Function**: `getGamesByDateAndSeason(supabase, date, seasonId)`
- **Line**: 32

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `input_date` | string | The date to retrieve games for (YYYY-MM-DD format) |
| `input_season_id` | integer | The ID of the season to filter by |

### Expected Output
Returns an array of game objects with the following structure:
```javascript
[
  {
    id: integer,              // Database primary key
    gameId: string,           // Unique game identifier
    seasonId: integer,        // Season ID (FK to Seasons table)
    date: string,             // Game date (YYYY-MM-DD)
    timestamp: string,        // Full game timestamp (ISO 8601)
    homeTeamName: string,     // Home team name
    homeTeamAbv: string,      // Home team abbreviation
    awayTeamName: string,     // Away team name
    awayTeamAbv: string       // Away team abbreviation
  },
  // ... more games
]
```

### SQL Logic
The function should perform the following operations:
1. Join `Games` table with `Teams` table twice (for home and away teams)
2. Filter for games where `DATE(date) = input_date`
3. Filter by the provided `seasonId`
4. Select game details along with team names and abbreviations

### Local Database Equivalent
See `db/general/Games.js` - `getTodaysGameswithNames(db, date, seasonId)` lines 77-107

---

## 3. get_games_for_results

### Purpose
Retrieves games for a specific date and league, including full team information. Used primarily for fetching game results from external APIs.

### Location
- **File**: `api/supabase/Games.js`
- **Function**: `getGamesForResults(supabase, date, seasonId)`
- **Line**: 58

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `input_date` | string | The date to retrieve games for (YYYY-MM-DD format) |
| `input_season_id` | integer | The ID of the season to filter by |

### Expected Output
Returns an array of game objects with extended team information:
```javascript
[
  {
    id: integer,              // Database primary key (Games.id)
    gameId: string,           // Unique game identifier
    seasonId: integer,        // Season ID (FK to Seasons table)
    leagueName: string,       // Name of the league
    date: string,             // Game date (YYYY-MM-DD)
    timestamp: string,        // Full game timestamp (ISO 8601)
    homeTeamId: integer,      // Home team ID
    homeTeamName: string,     // Home team name
    awayTeamId: integer,      // Away team ID
    awayTeamName: string      // Away team name
  },
  // ... more games
]
```

### SQL Logic
The function should perform the following operations:
1. Join `Games` table with `Teams` table twice (for home and away teams)
2. Join with `Seasons` table to get league information
3. Join with `Leagues` table to get league name
4. Filter for games where `DATE(date) = input_date`
5. Filter by the provided `seasonId`
6. Select game details with team IDs and names, plus league information

### Local Database Equivalent
See `db/general/Games.js` - `getGamesForResults(db, date, leagueName)` lines 39-74

### Usage Context
This function is used in `api/supabase/results.js` to fetch games that need result data from external sports APIs.

---

## 4. get_all_relevant_bet_markets

### Purpose
Retrieves all bet markets that are considered "relevant" (typically for recent/upcoming games within the last week).

### Location
- **File**: `api/supabase/BetMarkets.js`
- **Function**: `getAllRelevantBetMarkets(supabase)`
- **Line**: 4

### Parameters
None - this function takes no parameters.

### Expected Output
Returns an array of bet market objects:
```javascript
[
  {
    id: integer,              // Database primary key
    gameId: string,           // Game identifier (FK to Games table)
    marketType: string,       // Type of market (e.g., 'moneyline', 'spread', 'totals')
    timestamp: string,        // When the market was created/updated (ISO 8601)
    value: number,            // Market value (e.g., point spread, total points)
    odds: number,             // Odds for the market
    overUnder: string,        // 'over' or 'under' for O/U markets
    betTargetId: integer,     // Target of the bet (FK to BetTargets table)
    bookieId: integer         // Bookmaker offering the market (FK to Bookies table)
  },
  // ... more bet markets
]
```

### SQL Logic
The function should perform the following operations:
1. Select from `BetMarkets` table
2. Join with `Games` table to access game dates
3. Filter for games from the past week onwards (approximately: `date >= NOW() - INTERVAL '7 days'`)
4. Return all market data

### Usage Context
Used in `api/supabase/sync.js` - `syncBetMarkets(db, supabase)` to synchronize bet market data from Supabase to the local database.

---

## 5. get_upcoming_bet_markets

### Purpose
Retrieves bet markets for upcoming games (games scheduled for today or later).

### Location
- **File**: `api/supabase/BetMarkets.js`
- **Function**: `getUpcomingBetMarkets(supabase)`
- **Line**: 19

### Parameters
None - this function takes no parameters.

### Expected Output
Returns an array of bet market objects (same structure as `get_all_relevant_bet_markets`):
```javascript
[
  {
    id: integer,              // Database primary key
    gameId: string,           // Game identifier (FK to Games table)
    marketType: string,       // Type of market (e.g., 'moneyline', 'spread', 'totals')
    timestamp: string,        // When the market was created/updated (ISO 8601)
    value: number,            // Market value (e.g., point spread, total points)
    odds: number,             // Odds for the market
    overUnder: string,        // 'over' or 'under' for O/U markets
    betTargetId: integer,     // Target of the bet (FK to BetTargets table)
    bookieId: integer         // Bookmaker offering the market (FK to Bookies table)
  },
  // ... more bet markets
]
```

### SQL Logic
The function should perform the following operations:
1. Select from `BetMarkets` table
2. Join with `Games` table to access game dates
3. Filter for games where `date >= CURRENT_DATE`
4. Return all market data
5. Order by game date (ascending)

---

## 6. get_all_relevant_bet_targets

### Purpose
Retrieves all bet targets (teams, players, or other entities that can be bet on) that are relevant for recent/upcoming games.

### Location
- **File**: `api/supabase/BetTargets.js`
- **Function**: `getAllRelevantBetTargets(supabase)`
- **Line**: 4

### Parameters
None - this function takes no parameters.

### Expected Output
Returns an array of bet target objects:
```javascript
[
  {
    id: integer,              // Database primary key
    targetType: string,       // Type of target (e.g., 'team', 'player')
    targetName: string,       // Name of the target (e.g., team name, player name)
    teamId: integer,          // Team ID (FK to Teams table, nullable for non-team targets)
    gameId: string            // Game ID (FK to Games table)
  },
  // ... more bet targets
]
```

### SQL Logic
The function should perform the following operations:
1. Select from `BetTargets` table
2. Join with `Games` table to filter by game date
3. Filter for games from approximately the past week onwards (`date >= NOW() - INTERVAL '7 days'`)
4. Return all target data with associated game information

### Usage Context
Used in `api/supabase/sync.js` - `syncBetTargets(db, supabase)` to synchronize bet target data from Supabase to the local database.

---

## 7. get_active_leagues

### Purpose
Retrieves all leagues that have active seasons on a given date (leagues with games scheduled around that date).

### Location
- **File**: `api/supabase/Leagues.js`
- **Function**: `getActiveLeagues(supabase, date)`
- **Line**: 19

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `p_date` | string | The date to check for active leagues (YYYY-MM-DD format) |

### Expected Output
Returns an array of league objects:
```javascript
[
  {
    id: integer,              // Database primary key
    leagueName: string,       // Name of the league
    sport: string,            // Sport type (e.g., 'basketball', 'football')
    description: string       // League description
  },
  // ... more leagues
]
```

### SQL Logic
The function should perform the following operations:
1. Select DISTINCT leagues from `Leagues` table
2. Join with `Seasons` table
3. Filter for seasons where the provided date falls within the season's date range:
   - `startDate <= p_date`
   - `endDate >= p_date`
4. Return unique league information

### Local Database Equivalent
See `db/general/Leagues.js` - `getActiveLeagues(db, date)` lines 16-28

### Usage Context
Used in multiple places:
- `api/supabase/markets.js` - `refreshAllBettingMarkets(supabase)` to refresh betting markets for all active leagues
- For determining which leagues to display or process at a given time

---

## 8. get_all_relevant_game_results

### Purpose
Retrieves game results for recent games (typically from the past week).

### Location
- **File**: `api/supabase/GameResults.js`
- **Function**: `getAllRelevantGameResults(supabase)`
- **Line**: 4

### Parameters
None - this function takes no parameters.

### Expected Output
Returns an array of game result objects:
```javascript
[
  {
    id: integer,              // Database primary key
    gameId: string,           // Game identifier (FK to Games table)
    homeScore: integer,       // Final score of the home team
    awayScore: integer,       // Final score of the away team
    winner: integer           // Team ID of the winning team (FK to Teams table)
  },
  // ... more game results
]
```

### SQL Logic
The function should perform the following operations:
1. Select from `GameResults` table
2. Join with `Games` table to access game dates
3. Filter for games from approximately the past week onwards (`date >= NOW() - INTERVAL '7 days'`)
4. Return all result data

### Usage Context
Used in `api/supabase/sync.js` - `syncGameResults(db, supabase)` to synchronize game result data from Supabase to the local database.

---

## Implementation Notes

### General Patterns

1. **"Relevant" Data**: Functions with "relevant" in their name typically filter for data from approximately one week ago to the future. This timeframe is used to minimize data transfer and focus on actionable betting information.

2. **Date Filtering**: Most functions use date-based filtering to limit results to current or upcoming games. The typical pattern is:
   - Past week onwards: `date >= NOW() - INTERVAL '7 days'`
   - Upcoming only: `date >= CURRENT_DATE`

3. **Team Information**: Game-related functions typically join with the Teams table twice (aliasing one as Teams2 or similar) to get both home and away team information.

4. **Return Format**: All functions return arrays of objects, even if only one result is expected. Calling code should handle empty arrays appropriately.

### Recreating These Functions

If you need to recreate these RPC functions in Supabase:

1. Navigate to the SQL Editor in your Supabase project
2. Create each function using PostgreSQL's `CREATE OR REPLACE FUNCTION` syntax
3. Use the parameter names specified in this document
4. Implement the SQL logic described for each function
5. Test each function using Supabase's function testing tools

### Example Function Creation

Here's a template for creating an RPC function in Supabase:

```sql
CREATE OR REPLACE FUNCTION get_upcoming_games(input_season_id integer)
RETURNS TABLE (
  id integer,
  "gameId" text,
  "seasonId" integer,
  date text,
  timestamp text,
  "homeTeamName" text,
  "homeTeamAbv" text,
  "awayTeamName" text,
  "awayTeamAbv" text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g."gameId",
    g."seasonId",
    g.date,
    g.timestamp,
    t1."teamName" as "homeTeamName",
    t1.abbreviation as "homeTeamAbv",
    t2."teamName" as "awayTeamName",
    t2.abbreviation as "awayTeamAbv"
  FROM "Games" g
  JOIN "Teams" t1 ON g."homeTeamId" = t1.id
  JOIN "Teams" t2 ON g."awayTeamId" = t2.id
  WHERE g.date >= CURRENT_DATE
    AND g."seasonId" = input_season_id
  ORDER BY g.date ASC;
END;
$$ LANGUAGE plpgsql;
```

### Security Considerations

When recreating these functions, consider:
- Adding appropriate Row Level Security (RLS) policies
- Using `SECURITY DEFINER` vs `SECURITY INVOKER` appropriately
- Validating input parameters to prevent SQL injection
- Adding proper indexes on filtered columns for performance

---

## Conclusion

These 8 RPC functions form the core of the BetSmart application's data retrieval layer for Supabase. They optimize complex queries by performing joins and filtering on the server side, reducing the amount of data transferred to the client application.

Before recreating these functions, assess whether:
1. Your application still needs real-time data from Supabase
2. The local SQLite database synchronization is sufficient for your use case
3. The performance benefits justify the complexity of managing these Edge Functions

If you're experiencing issues with your Supabase project, consider the local database functions in the `db/` directory as alternatives, which provide similar functionality using expo-sqlite.
