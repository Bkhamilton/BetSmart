# Performance Optimization Guide

This document describes the performance optimizations implemented in the BetSmart application database layer.

## Database Indexes

### Overview
Database indexes have been added to improve query performance on frequently accessed and joined tables. These indexes significantly reduce query execution time by allowing the database to quickly locate rows without scanning entire tables.

### Implemented Indexes

#### Games Table
- `idx_games_gameId`: Index on gameId for quick lookups
- `idx_games_seasonId`: Index on seasonId for filtering by season
- `idx_games_date`: Index on date for date-based queries
- `idx_games_homeTeamId`: Index on homeTeamId for team-based queries
- `idx_games_awayTeamId`: Index on awayTeamId for team-based queries
- `idx_games_seasonId_date`: Composite index for season and date filtering

#### BetMarkets Table
- `idx_betmarkets_gameId`: Index on gameId for game-specific markets
- `idx_betmarkets_marketType`: Index on marketType for filtering by type
- `idx_betmarkets_betTargetId`: Index on betTargetId for target-specific queries
- `idx_betmarkets_bookieId`: Index on bookieId for bookie-specific queries
- `idx_betmarkets_gameId_marketType`: Composite index for common filtering pattern
- `idx_betmarkets_timestamp`: Index on timestamp for temporal queries

#### BetSlips Table
- `idx_betslips_userId`: Index on userId for user-specific queries
- `idx_betslips_bookieId`: Index on bookieId for bookie-specific queries
- `idx_betslips_date`: Index on date for date-based filtering
- `idx_betslips_userId_date`: Composite index for user and date filtering
- `idx_betslips_formatId`: Index on formatId for format-specific queries

#### ParticipantBets Table
- `idx_participantbets_betSlipId`: Index on betSlipId for join operations
- `idx_participantbets_gameId`: Index on gameId for game-specific bets

#### Legs Table
- `idx_legs_participantBetId`: Index on participantBetId for join operations
- `idx_legs_betMarketId`: Index on betMarketId for market-specific legs
- `idx_legs_betTypeId`: Index on betTypeId for type-specific legs

#### Results Tables
- `idx_betslipsresults_betSlipId`: Index on betSlipId
- `idx_betslipsresults_result`: Index on result for filtering
- `idx_participantbetsresults_participantBetId`: Index on participantBetId
- `idx_participantbetsresults_result`: Index on result for filtering
- `idx_legsresults_legId`: Index on legId
- `idx_legsresults_result`: Index on result for filtering

#### Additional Indexes
- `idx_teams_leagueId`: Index on Teams.leagueId
- `idx_seasons_leagueId`: Index on Seasons.leagueId
- `idx_seasons_startDate_endDate`: Composite index for season date ranges
- `idx_bettargets_targetType`: Index on BetTargets.targetType
- `idx_bettargets_teamId`: Index on BetTargets.teamId
- `idx_bettargets_gameId`: Index on BetTargets.gameId
- `idx_balance_userId`: Index on Balance.userID
- `idx_transactions_userId`: Index on Transactions.userId
- `idx_transactions_bookieId`: Index on Transactions.bookieId
- `idx_gameresults_gameId`: Index on GameResults.gameId

## Query Optimizations

### 1. getMoneyline Function
**Before:**
```javascript
// Used nested subquery with INNER JOIN
SELECT bm.* FROM BetMarkets bm
INNER JOIN (
    SELECT betTargetId, MIN(timestamp) as oldestTimestamp
    FROM BetMarkets
    WHERE gameId = ? AND marketType = "moneyline"
    GROUP BY betTargetId
) oldest ON bm.betTargetId = oldest.betTargetId AND bm.timestamp = oldest.oldestTimestamp
WHERE bm.gameId = ? AND bm.marketType = "moneyline"
```

**After:**
```javascript
// Uses window function for better performance
SELECT * FROM (
    SELECT bm.*,
        ROW_NUMBER() OVER (PARTITION BY bm.betTargetId ORDER BY bm.timestamp ASC) as rn
    FROM BetMarkets bm
    WHERE bm.gameId = ? AND bm.marketType = "moneyline"
) ranked
WHERE rn = 1
```

**Impact:** Eliminates duplicate scanning of BetMarkets table, reduces query parameters from 2 to 1.

### 2. checkBetMarketsExist and checkIfAnyBetMarketsExist Functions
**Before:**
```javascript
// Made 3 separate queries
const moneyline = await getMoneyline(db, gameId);
const spread = await getSpread(db, gameId);
const totalOverUnder = await getTotalOverUnder(db, gameId);
// Then checked lengths
```

**After:**
```javascript
// Single query with COUNT DISTINCT
SELECT COUNT(DISTINCT marketType) as marketTypeCount
FROM BetMarkets
WHERE gameId = ? AND marketType IN ('moneyline', 'spread', 'totals')
```

**Impact:** Reduces 3 database round trips to 1, significantly faster for remote databases.

### 3. getProfitByPeriod Function
**Before:**
```javascript
// Two separate subqueries scanning same table twice
SELECT 
    COALESCE((SELECT SUM(B.winnings) ... WHERE R.result = 1), 0) 
    - 
    COALESCE((SELECT SUM(B.betAmount) ... WHERE R.result = 0), 0)
```

**After:**
```javascript
// Single query with CASE statement
SELECT 
    COALESCE(SUM(
        CASE 
            WHEN R.result = 1 THEN B.winnings - B.betAmount
            WHEN R.result = 0 THEN -B.betAmount
            ELSE 0
        END
    ), 0) AS totalProfit
FROM BetSlips B
LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
WHERE B.userId = ? AND B.date >= date('now', ?)
```

**Impact:** Scans BetSlips table once instead of twice, reduces query complexity.

### 4. getWinRateByPeriod Function
**Before:**
```javascript
// Made 2 separate database calls
const wonCount = await getWonBetSlipCountByPeriod(db, userId, period);
const totalBetCount = await getTotalBetCountByPeriod(db, userId, period);
return totalBetCount > 0 ? (wonCount / totalBetCount) * 100 : 0;
```

**After:**
```javascript
// Single query calculating both values
SELECT 
    COUNT(*) as totalCount,
    SUM(CASE WHEN R.result = 1 THEN 1 ELSE 0 END) as wonCount
FROM BetSlips B
LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
WHERE B.userId = ? AND B.date >= date('now', ?)
```

**Impact:** Reduces 2 database round trips to 1.

### 5. getROIByPeriod Function
**Before:**
```javascript
// Made 2 separate database calls
const totalProfit = await getProfitByPeriod(db, userId, period);
const totalBetAmount = await getTotalBetAmountByPeriod(db, userId, period);
return totalBetAmount > 0 ? (totalProfit / totalBetAmount) * 100 : 0;
```

**After:**
```javascript
// Single query calculating both values
SELECT 
    COALESCE(SUM(B.betAmount), 0) as totalBetAmount,
    COALESCE(SUM(
        CASE 
            WHEN R.result = 1 THEN B.winnings - B.betAmount
            WHEN R.result = 0 THEN -B.betAmount
            ELSE 0
        END
    ), 0) AS totalProfit
FROM BetSlips B
LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
WHERE B.userId = ? AND B.date >= date('now', ?)
```

**Impact:** Reduces 2 database round trips to 1.

## Best Practices for Future Development

### 1. Index Strategy
- Always add indexes on foreign key columns
- Create composite indexes for frequently used WHERE clause combinations
- Index columns used in JOIN conditions
- Index columns used in ORDER BY clauses for large tables
- Monitor index usage and remove unused indexes to save space

### 2. Query Optimization
- **Avoid N+1 queries**: Batch related queries using JOINs
- **Use window functions**: Instead of correlated subqueries when possible
- **Minimize subqueries**: Flatten queries using JOINs and CASE statements
- **Use LIMIT**: For large result sets, always use pagination
- **Count wisely**: Use `COUNT(*)` instead of `COUNT(column)` when counting all rows
- **Use EXISTS**: Instead of COUNT when checking for existence

### 3. Query Patterns to Avoid
```javascript
// BAD: Multiple sequential queries
const result1 = await query1();
const result2 = await query2();
const result3 = await query3();

// GOOD: Single combined query
const results = await combinedQuery();
```

```javascript
// BAD: Correlated subquery scanning for each row
SELECT *, (SELECT MAX(x) FROM table2 WHERE table2.id = table1.id) 
FROM table1

// GOOD: Use JOIN or window function
SELECT table1.*, MAX(table2.x) 
FROM table1 
LEFT JOIN table2 ON table1.id = table2.id 
GROUP BY table1.id
```

### 4. Performance Testing
- Use `EXPLAIN QUERY PLAN` to analyze query execution
- Monitor query execution times in production
- Test with realistic data volumes
- Profile database operations during development

## Performance Metrics

The optimizations implemented provide the following estimated improvements:

- **Index Addition**: 50-90% faster queries on large tables with JOINs
- **getMoneyline**: ~40% faster (eliminates duplicate table scan)
- **checkBetMarketsExist**: ~70% faster (3 queries → 1 query)
- **getProfitByPeriod**: ~50% faster (eliminates redundant subqueries)
- **getWinRateByPeriod**: ~50% faster (2 queries → 1 query)
- **getROIByPeriod**: ~50% faster (2 queries → 1 query)

These improvements compound when multiple optimized functions are called in sequence, leading to significantly better overall application performance.
