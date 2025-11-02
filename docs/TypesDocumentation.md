# TypeScript Types Documentation

This document provides an overview of the TypeScript types defined in `constants/types.ts` for use when converting JavaScript screen files to TypeScript.

## Overview

The `constants/types.ts` file contains comprehensive type definitions for the BetSmart application. These types are derived from:

- Existing TypeScript context files (`UserContext.tsx`, `BetContext.tsx`, `DBContext.tsx`, `SupabaseContext.tsx`)
- Database schema documentation (`docs/DatabaseSchema.md`)
- Analysis of JavaScript screen files and their data structures

## Usage

To use these types in your TypeScript screen files, import them as needed:

```typescript
import { User, Balance, BetSlip, Game, League } from '@/constants/types';

// Example usage in a screen component
export default function HomeScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [betSlips, setBetSlips] = useState<DBBetSlip[]>([]);
    // ...
}
```

## Type Categories

### User Related Types
- `User` - User account information
- `Balance` - User balance for each bookie
- `Preference` - User betting preferences (array format)
- `DBPreference` - User preferences as stored in database (comma-separated strings)
- `LocationStatus` - User's location verification status

### Bookie Related Types
- `Bookie` - Bookmaker information
- `Bonus` - Bonus offers from bookmakers

### League and Sports Related Types
- `League` - Sports league information
- `Season` - Season details for a league
- `LeagueProp` - League-specific properties
- `LeaguePropInfo` - Additional league property information

### Team and Player Related Types
- `Team` - Team information
- `Player` - Player information

### Game Related Types
- `Game` - Game/match information
- `GameResult` - Results of completed games

### Betting Related Types
- `BetSlip` - In-memory bet slip representation
- `DBBetSlip` - Bet slip as stored in database
- `BetSlipResult` - Result of a bet slip
- `Bet` - Individual bet within a bet slip
- `ParticipantBet` - Bet on a specific game
- `ParticipantBetResult` - Result of a participant bet
- `Leg` - Individual leg/selection within a bet
- `DBLeg` - Leg as stored in database
- `LegResult` - Result of a leg
- `BetMarket` - Available betting market
- `BetTarget` - Target of a bet (team/player)
- `BetType` - Type of bet (spread, moneyline, etc.)
- `BetFormat` - Format of bet slip (single, parlay, etc.)

### Transaction Related Types
- `Transaction` - Financial transaction record

### Data Fetching Related Types
- `FetchHistory` - API fetch history for leagues
- `MarketFetchHistory` - API fetch history for markets

### Navigation and Screen Props
- `ScreenProps` - Standard screen props for navigation

### Modal Related Types
- `ModalProps` - Common props for modal components

### Hook Return Types
- `UseHookHomeReturn` - Return type for useHookHome
- `UseConfirmationStateReturn` - Return type for useConfirmationState
- `UseUserBalDataStateReturn` - Return type for useUserBalDataState
- `UseOptionsStateReturn` - Return type for useOptionsState

### Insights and Analytics Types
- `BettingPerformanceData` - Betting performance metrics
- `AnalyticsData` - Analytics data for various time periods

### Component Props Types
- `GameListProps` - Props for GameList component
- `BetSlipListProps` - Props for BetSlipList component
- `TransactionListProps` - Props for TransactionList component
- `HeaderProps` - Props for header components

### Form Input Types
- `LoginFormData` - Login form data
- `SignupFormData` - Signup form data
- `TransactionFormData` - Transaction form data
- `BetPreferencesFormData` - Bet preferences form data

### API Response Types
- `SupabaseGame` - Game data from Supabase API
- `SupabaseBetMarket` - Bet market data from Supabase API

### Selection and Filter Types
- `TimeFilter` - Time period filter
- `BetTypeFilter` - Bet type filter
- `LeagueFilter` - League filter

### Sport Data Types
- `SportData` - Sport-specific game data
- `AllSportsData` - Collection of sport data

## Key Differences Between Types

### BetSlip vs DBBetSlip
- `BetSlip`: Used in the application state (date is `Date` object, odds is `number`)
- `DBBetSlip`: Used when reading from database (date is `string`, odds is `string`)

### Preference vs DBPreference
- `Preference`: Application format with array fields
- `DBPreference`: Database format with comma-separated string fields

### Leg vs DBLeg
- `Leg`: Application format with detailed bet information
- `DBLeg`: Database format with ID references

## Converting JavaScript Screens to TypeScript

When converting a JavaScript screen file to TypeScript:

1. **Add type imports** at the top of the file:
   ```typescript
   import { User, BetSlip, Game, League } from '@/constants/types';
   ```

2. **Type your state variables**:
   ```typescript
   const [user, setUser] = useState<User | null>(null);
   const [games, setGames] = useState<Game[]>([]);
   ```

3. **Type your props** if the component receives any:
   ```typescript
   interface MyScreenProps {
       navigation: any;
       route: any;
   }
   
   export default function MyScreen({ navigation, route }: MyScreenProps) {
       // ...
   }
   ```

4. **Use context types** from the context files:
   ```typescript
   const { user, userBalance, preferences } = useContext(UserContext);
   // user is already typed as User | null
   // userBalance is already typed as Balance[] | null
   // preferences is already typed as Preference
   ```

5. **Type function parameters and returns**:
   ```typescript
   const handleGameSelect = (game: Game): void => {
       // ...
   };
   
   const fetchBetSlips = async (): Promise<DBBetSlip[]> => {
       // ...
   };
   ```

## Example Conversion

### Before (JavaScript):
```javascript
import React, { useState } from 'react';

export default function BetHistoryScreen() {
    const [betSlips, setBetSlips] = useState([]);
    const [selectedType, setSelectedType] = useState('All');
    
    const changeType = (type) => {
        setSelectedType(type);
    };
    
    return (
        <BetSlipList betSlips={betSlips} />
    );
}
```

### After (TypeScript):
```typescript
import React, { useState } from 'react';
import { DBBetSlip } from '@/constants/types';

export default function BetHistoryScreen() {
    const [betSlips, setBetSlips] = useState<DBBetSlip[]>([]);
    const [selectedType, setSelectedType] = useState<string>('All');
    
    const changeType = (type: string): void => {
        setSelectedType(type);
    };
    
    return (
        <BetSlipList betSlips={betSlips} />
    );
}
```

## Best Practices

1. **Always use exported types** from `constants/types.ts` rather than defining inline types
2. **Use `| null`** for values that can be null or undefined
3. **Use arrays with `[]`** syntax (e.g., `Game[]` instead of `Array<Game>`)
4. **Export component props interfaces** when they might be reused
5. **Keep hook return types consistent** with the defined hook return type interfaces
6. **Use database types (DB prefix)** when working directly with database query results
7. **Use application types (no prefix)** when working with in-memory state

## Notes

- The types file uses `export interface` to allow for declaration merging if needed
- All types are exported for maximum flexibility
- Database types use `string` for fields that are stored as text in SQLite
- Application types use native JavaScript types (`Date`, `number`) for better developer experience
- Optional fields are marked with `?` in the interface definition
