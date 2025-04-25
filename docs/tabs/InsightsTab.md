# Insights Tab Documentation

The Insights Tab provides users with actionable insights, performance analysis, and recommendations to improve their betting strategies. Below is an overview of its components and functionality.

## Components

### 1. **InsightHeader**

-   Displays the header for the Insights Tab.
-   Includes a button or action handler (`onPress`) for future functionality.

### 2. **InsightIntro**

-   Provides an introduction to the user's current streak and performance metrics.
-   Props:
    -   `streak`: The user's current streak data.

### 3. **BetAnalysis**

-   Analyzes the user's betting performance.
-   Props:
    -   `streak`: The user's current streak data.

### 4. **TopBet**

-   Highlights the user's top-performing bet.
-   Props:
    -   `betSlip`: Data for the top bet.

### 5. **BankManagement**

-   Offers insights into the user's bank management strategies.
-   Props:
    -   `streak`: The user's current streak data.

### 6. **PreferenceAdherence**

-   Displays how well the user's betting aligns with their preferences.

## Insights Logic

### Actionable Insights

-   **State Variables**:

    -   `actionableInsights`: Stores the list of insights fetched from the database.
    -   `loading`: Indicates whether the data is still loading.

-   **Data Fetching**:
    -   Insights are fetched using the `getActionableInsights` utility function.
    -   The function retrieves insights based on the user's ID from the database.

### Rendering Insights

-   Insights are displayed as cards using the `renderInsightCard` function.
-   Each card includes:
    -   A message describing the insight.
    -   Styling for better readability.

### Text Color Logic

-   The `getTextColor` function determines the color of text based on the type of insight:
    -   `success`: Green (`#2e7d32`)
    -   `warning`: Orange (`#ed6c02`)
    -   `improvement`: Red (`#d32f2f`)
    -   `strategy`: Blue (`#1565c0`)
    -   Default: Gray (`#333333`)

## Lifecycle Hooks

### `useEffect` for Initialization

-   Creates temporary tables in the database using `createTempTables`.
-   Sets the `loading` state to `false` once initialization is complete.

### `useEffect` for Loading Insights

-   Fetches actionable insights when the user or loading state changes.

## Future Enhancements

-   Add behavioral analysis, learning opportunities, and comparative analysis sections.
-   Enhance the `InsightHeader` with additional functionality.

## Excluded Functions

The following functions are used for testing and debugging purposes and are not part of the production functionality:

-   `refreshMarkets`
-   `refreshPlayers`
-   `tempFunction`
