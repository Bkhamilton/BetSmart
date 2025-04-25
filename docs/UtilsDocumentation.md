# Utils Documentation

This document provides an overview of all utility files and their functionality.

---

## **propBannerMapping.js**

Maps prop types to their corresponding React components for rendering banners in the betting interface.

### Key Mappings:

-   `Player`: `MainPlayer`
-   `Player Alt`: `AltPlayer`
-   `Total`: `TotalDisplay`
-   `Spread`: `SpreadDisplay`
-   `Moneyline`: `MoneylineDisplay`
-   ...and more.

---

## **insights.js**

Generates actionable insights for users based on their betting performance.

### Key Functions:

-   `getActionableInsights(db, userId)`: Fetches insights such as ROI, league performance, market performance, and streaks.
-   `getActionableInsights2(db, userId)`: An alternative implementation for generating insights with additional metrics.

---

## **dbHelpers.js**

Provides helper functions for database operations related to bet results and user balances.

### Key Functions:

-   `confirmBetResults(db, betSlip, user)`: Confirms bet results, updates the database, and adjusts the user's balance.

---

## **dateFunctions.js**

Handles date and time formatting.

### Key Functions:

-   `getDate(dateString)`: Returns the date in `MM/DD` format.
-   `getDateFull(dateString)`: Returns the date in `YYYY-MM-DD` format.
-   `getTime(dateString)`: Returns the time in 12-hour format.
-   `getAmPm(dateString)`: Returns `AM` or `PM` based on the time.

---

## **componentMapping.js**

Maps league prop types to their corresponding React components for rendering.

### Key Mappings:

-   `alt-line`: `AltLine`
-   `main-line`: `MainLine`
-   `game-lines`: `GameLines`
-   `player-props`: `PlayerProps`
-   `moneyline`: `Moneyline`
-   `spread`: `Spread`
-   `total-over-under`: `TotalOverUnder`
-   ...and more.

---

## **betSlipFunctions.js**

Provides utility functions for handling bet slips.

### Key Functions:

-   `condenseName(fullName)`: Condenses a full name into an abbreviated format (e.g., "John Doe" → "J. Doe").
-   `displayLeg(leg, betTargetName)`: Formats a leg of a bet slip for display.
-   `countMarketTypes(betSlips)`: Counts and categorizes market types in a list of bet slips.

---

## **betMarketHelpers.js**

Handles grouping, sorting, and analyzing bet market data.

### Key Functions:

-   `groupByTimestampAndBookie(betMarkets, currentGame)`: Groups bet markets by timestamp and bookie ID.
-   `sortBetMarkets(betMarkets)`: Sorts bet markets by timestamp and bookie ID.
-   `getBestOdds(marketData)`: Finds the best odds (closest to -100 or +100) from a list of market data.
