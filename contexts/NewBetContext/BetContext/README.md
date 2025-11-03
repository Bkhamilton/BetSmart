# BetContext Refactoring

## Overview
The BetContext has been refactored into multiple focused context files to improve maintainability and separation of concerns. The original 180-line BetContext.tsx file managed 4 distinct areas of state, which have now been separated into dedicated context files.

## New Context Files

### 1. GameContext.tsx
**Purpose**: Manages the currently selected game state

**State**:
- `currentGame: Game | null` - The currently selected game
- `setCurrentGame: (game: Game | null) => void` - Updates the current game

**Usage**: When users browse games and select one to view betting options

### 2. LeagueContext.tsx
**Purpose**: Manages the currently selected league state

**State**:
- `league: League | null` - The currently selected league
- `setLeague: (league: League | null) => void` - Updates the current league

**Usage**: For filtering games and betting options by sport/league

### 3. BookieSelectionContext.tsx
**Purpose**: Manages bookie selection for odds and bets

**State**:
- `bookie: string | null` - The name of the selected bookie (default: 'DraftKings')
- `setBookie: (bookie: string | null) => void` - Updates the bookie name
- `bookieId: number | null` - The ID of the selected bookie (default: 1)
- `setBookieId: (bookieId: number | null) => void` - Updates the bookie ID

**Usage**: Tracks which bookie's odds are being displayed and used for bets

### 4. BetSlipContext.tsx
**Purpose**: Manages the betting slip and bet operations

**State**:
- `betSlip: BetSlip | null` - The current bet slip with all bets and legs
- `setBetSlip: (betSlip: BetSlip | null) => void` - Updates the bet slip
- `totalLegs: number | null` - Total number of legs across all bets
- `setTotalLegs: (totalLegs: number) => void` - Updates the total legs count

**Actions**:
- `selectProp: (props: {...}) => void` - Adds or removes a prop from the bet slip
- `confirmBetSlip: (db: any) => Promise<void>` - Confirms and saves the bet slip to the database

**Dependencies**:
- UserContext (for user info and balance updates)
- GameContext (for current game)
- LeagueContext (for league info)
- BookieSelectionContext (for bookie ID)

## Backward Compatibility

The original `BetContext.tsx` file has been maintained as a **compatibility layer** that:

1. **Combines all contexts**: Uses a custom hook (`useCombinedBetContext`) to merge all 4 context values
2. **Maintains the same API**: Existing code using `BetContext` continues to work without changes
3. **Re-exports individual contexts**: Allows direct use of specific contexts when needed

### Example Usage (Backward Compatible)
```typescript
// This still works exactly as before
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';

const MyComponent = () => {
  const { currentGame, league, betSlip, selectProp } = useContext(BetContext);
  // All values are available as before
};
```

### Example Usage (Direct Context Access)
```typescript
// New option: Use specific contexts directly
import { GameContext } from '@/contexts/NewBetContext/GameContext';
import { BetSlipContext } from '@/contexts/NewBetContext/BetSlipContext';

const MyComponent = () => {
  const { currentGame } = useContext(GameContext);
  const { betSlip, selectProp } = useContext(BetSlipContext);
  // More explicit about dependencies
};
```

## Context Hierarchy

The contexts are arranged in a specific hierarchy within `BetContextProvider`:

```
BetContextProvider
  └── GameContextProvider
      └── LeagueContextProvider
          └── BookieSelectionContextProvider
              └── BetSlipContextProvider
                  └── BetContext (combined wrapper)
```

This hierarchy ensures that:
- Inner contexts can access outer contexts (e.g., BetSlipContext can access GameContext)
- Changes propagate correctly through the hierarchy
- Each context is initialized before contexts that depend on it

## File Locations

- `/contexts/NewBetContext/GameContext.tsx` - Game state management
- `/contexts/NewBetContext/LeagueContext.tsx` - League state management
- `/contexts/NewBetContext/BookieSelectionContext.tsx` - Bookie selection management
- `/contexts/NewBetContext/BetSlipContext.tsx` - Bet slip management
- `/contexts/NewBetContext/BetContext/BetContext.tsx` - Backward-compatible wrapper
- `/contexts/NewBetContext/BetContext/betSlipHelpers.js` - Helper functions (unchanged)

## Type Definitions

New interfaces added to `/constants/types.ts`:
- `GameContextValue`
- `LeagueContextValue`
- `BookieSelectionContextValue`
- `BetSlipContextValue`

The original `BetContextValue` interface remains unchanged.

## Migration Guide

### For New Code
Consider using the specific contexts directly for better clarity:

```typescript
// Before
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
const { currentGame } = useContext(BetContext);

// After (optional, more explicit)
import { GameContext } from '@/contexts/NewBetContext/GameContext';
const { currentGame } = useContext(GameContext);
```

### For Existing Code
No changes required! All existing code continues to work with the backward-compatible `BetContext`.

## Benefits

1. **Improved Maintainability**: Each context has a single, clear responsibility
2. **Better Code Organization**: Related state and logic are grouped together
3. **Reduced Coupling**: Components can depend on only the contexts they need
4. **Easier Testing**: Smaller, focused contexts are easier to test in isolation
5. **Backward Compatible**: Zero breaking changes for existing code
6. **Better Performance**: Components re-render only when their specific context changes
