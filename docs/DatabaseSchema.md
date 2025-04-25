# DATABASE_SCHEMA.md

# Database Schema Documentation

This document provides a comprehensive overview of the database schema used in the BetSmart project. It details the structure of tables, their relationships, and key functions associated with each table.

## Tables Overview

### 1. BetMarkets

-   **Description**: This table stores information related to various betting markets for different games.
-   **Columns**:
    -   `id`: Unique identifier for the bet market (Primary Key).
    -   `gameId`: Identifier for the game associated with the bet market (Foreign Key).
    -   `marketType`: Type of the market (e.g., moneyline, spread, totals).
    -   `timestamp`: The time when the market was created or updated.
    -   `value`: The value associated with the market (e.g., point spread, total points).
    -   `odds`: The odds for the market.
    -   `overUnder`: Indicates if the market is an over/under bet.
    -   `betTargetId`: Identifier for the target of the bet (Foreign Key).
    -   `bookieId`: Identifier for the bookmaker offering the market (Foreign Key).

### 2. BetTargets

-   **Description**: This table contains information about the targets for bets, such as teams or players.
-   **Columns**:
    -   `id`: Unique identifier for the bet target (Primary Key).
    -   `targetName`: Name of the target (e.g., team name, player name).

### 3. Bookies

-   **Description**: This table stores information about the bookmakers.
-   **Columns**:
    -   `id`: Unique identifier for the bookmaker (Primary Key).
    -   `name`: Name of the bookmaker.
    -   `website`: URL of the bookmaker's website.

### 4. Users

-   **Description**: This table stores information about the users of the BetSmart platform.
-   **Columns**:
    -   `id`: Unique identifier for the user (Primary Key).
    -   `username`: The username of the user.
    -   `email`: The email address of the user.
    -   `passwordHash`: The hashed password for the user.
    -   `createdAt`: The timestamp when the user account was created.
    -   `updatedAt`: The timestamp when the user account was last updated.

### 5. Bets

-   **Description**: This table stores information about individual bets placed by users.
-   **Columns**:
    -   `id`: Unique identifier for the bet (Primary Key).
    -   `userId`: Identifier for the user who placed the bet (Foreign Key).
    -   `betMarketId`: Identifier for the bet market associated with the bet (Foreign Key).
    -   `stake`: The amount of money staked on the bet.
    -   `potentialPayout`: The potential payout for the bet.
    -   `status`: The status of the bet (e.g., pending, won, lost).
    -   `placedAt`: The timestamp when the bet was placed.

### 6. Transactions

-   **Description**: This table tracks financial transactions related to user accounts.
-   **Columns**:
    -   `id`: Unique identifier for the transaction (Primary Key).
    -   `userId`: Identifier for the user associated with the transaction (Foreign Key).
    -   `amount`: The amount of money involved in the transaction.
    -   `transactionType`: The type of transaction (e.g., deposit, withdrawal).
    -   `timestamp`: The timestamp when the transaction occurred.

### 7. Preferences

-   **Description**: This table stores user-specific preferences.
-   **Columns**:
    -   `id`: Unique identifier for the preference (Primary Key).
    -   `userId`: Identifier for the user associated with the preference (Foreign Key).
    -   `preferenceName`: Name of the preference.
    -   `preferenceValue`: Value of the preference.

### 8. Bonuses

-   **Description**: This table stores information about bonuses offered to users.
-   **Columns**:
    -   `id`: Unique identifier for the bonus (Primary Key).
    -   `bookieId`: Identifier for the bookmaker offering the bonus (Foreign Key).
    -   `userId`: Identifier for the user receiving the bonus (Foreign Key).
    -   `bonusType`: Type of the bonus (e.g., deposit bonus, free bet).
    -   `bonusAmount`: The amount of the bonus.
    -   `timestamp`: The timestamp when the bonus was issued.
    -   `description`: Description of the bonus.

### 9. Balance

-   **Description**: This table tracks the balance of users with bookmakers.
-   **Columns**:
    -   `id`: Unique identifier for the balance record (Primary Key).
    -   `bookieId`: Identifier for the bookmaker (Foreign Key).
    -   `userId`: Identifier for the user (Foreign Key).
    -   `balance`: The balance amount.

### 10. BetSlips

-   **Description**: This table stores information about bet slips created by users.
-   **Columns**:
    -   `id`: Unique identifier for the bet slip (Primary Key).
    -   `formatId`: Identifier for the bet format (Foreign Key).
    -   `date`: The date the bet slip was created.
    -   `odds`: The odds associated with the bet slip.
    -   `betAmount`: The amount of money wagered on the bet slip.
    -   `winnings`: The potential winnings for the bet slip.
    -   `userId`: Identifier for the user who created the bet slip (Foreign Key).
    -   `bookieId`: Identifier for the bookmaker associated with the bet slip (Foreign Key).

### 11. BetSlipsResults

-   **Description**: This table stores the results of bet slips.
-   **Columns**:
    -   `id`: Unique identifier for the result (Primary Key).
    -   `betSlipId`: Identifier for the bet slip (Foreign Key).
    -   `result`: The result of the bet slip (e.g., won, lost).

### 12. ParticipantBets

-   **Description**: This table stores information about individual bets within a bet slip.
-   **Columns**:
    -   `id`: Unique identifier for the participant bet (Primary Key).
    -   `betSlipId`: Identifier for the bet slip (Foreign Key).
    -   `gameId`: Identifier for the game associated with the bet (Foreign Key).
    -   `odds`: The odds for the bet.

### 13. ParticipantBetsResults

-   **Description**: This table stores the results of participant bets.
-   **Columns**:
    -   `id`: Unique identifier for the result (Primary Key).
    -   `participantBetId`: Identifier for the participant bet (Foreign Key).
    -   `result`: The result of the participant bet (e.g., won, lost).

### 14. Legs

-   **Description**: This table stores information about individual legs within a participant bet.
-   **Columns**:
    -   `id`: Unique identifier for the leg (Primary Key).
    -   `participantBetId`: Identifier for the participant bet (Foreign Key).
    -   `betMarketId`: Identifier for the bet market associated with the leg (Foreign Key).
    -   `betTypeId`: Identifier for the bet type (Foreign Key).

### 15. LegsResults

-   **Description**: This table stores the results of legs.
-   **Columns**:
    -   `id`: Unique identifier for the result (Primary Key).
    -   `legId`: Identifier for the leg (Foreign Key).
    -   `result`: The result of the leg (e.g., won, lost).

### 16. Teams

-   **Description**: This table stores information about teams.
-   **Columns**:
    -   `id`: Unique identifier for the team (Primary Key).
    -   `teamName`: Name of the team.
    -   `abbreviation`: Abbreviation of the team name.
    -   `leagueId`: Identifier for the league the team belongs to (Foreign Key).
    -   `logoUrl`: URL of the team's logo.

### 17. Players

-   **Description**: This table stores information about players.
-   **Columns**:
    -   `id`: Unique identifier for the player (Primary Key).
    -   `name`: Name of the player.
    -   `position`: Position of the player.
    -   `number`: Jersey number of the player.
    -   `image`: URL of the player's image.
    -   `teamId`: Identifier for the team the player belongs to (Foreign Key).

### 18. Leagues

-   **Description**: This table stores information about leagues.
-   **Columns**:
    -   `id`: Unique identifier for the league (Primary Key).
    -   `leagueName`: Name of the league.
    -   `sport`: The sport associated with the league.
    -   `description`: Description of the league.

### 19. Seasons

-   **Description**: This table stores information about seasons within leagues.
-   **Columns**:
    -   `id`: Unique identifier for the season (Primary Key).
    -   `leagueId`: Identifier for the league the season belongs to (Foreign Key).
    -   `season`: Name or year of the season.
    -   `games`: Number of games in the season.
    -   `description`: Description of the season.
    -   `seasonType`: Type of the season (e.g., regular, playoffs).
    -   `startDate`: Start date of the season.
    -   `endDate`: End date of the season.

### 20. Games

-   **Description**: This table stores information about games.
-   **Columns**:
    -   `id`: Unique identifier for the game (Primary Key).
    -   `gameId`: Identifier for the game.
    -   `seasonId`: Identifier for the season the game belongs to (Foreign Key).
    -   `date`: Date of the game.
    -   `timestamp`: Timestamp of the game.
    -   `homeTeamId`: Identifier for the home team (Foreign Key).
    -   `awayTeamId`: Identifier for the away team (Foreign Key).

### 21. GameResults

-   **Description**: This table stores the results of games.
-   **Columns**:
    -   `id`: Unique identifier for the result (Primary Key).
    -   `gameId`: Identifier for the game (Foreign Key).
    -   `homeScore`: Score of the home team.
    -   `awayScore`: Score of the away team.
    -   `winner`: Identifier for the winning team (Foreign Key).

### 22. FetchHistory

-   **Description**: This table tracks the history of data fetches.
-   **Columns**:
    -   `id`: Unique identifier for the fetch history record (Primary Key).
    -   `league`: Name of the league.
    -   `lastFetched`: Timestamp of the last fetch.

### 23. MarketFetchHistory

-   **Description**: This table tracks the history of market data fetches.
-   **Columns**:
    -   `id`: Unique identifier for the fetch history record (Primary Key).
    -   `gameId`: Identifier for the game (Foreign Key).
    -   `marketType`: Type of the market.
    -   `lastFetched`: Timestamp of the last fetch.

### 24. BetTypes

-   **Description**: This table stores information about bet types.
-   **Columns**:
    -   `id`: Unique identifier for the bet type (Primary Key).
    -   `betType`: Name of the bet type.
    -   `description`: Description of the bet type.

### 25. BetFormats

-   **Description**: This table stores information about bet formats.
-   **Columns**:
    -   `id`: Unique identifier for the bet format (Primary Key).
    -   `formatName`: Name of the bet format.
    -   `description`: Description of the bet format.

### 26. LeagueProps

-   **Description**: This table stores properties associated with leagues.
-   **Columns**:
    -   `id`: Unique identifier for the league property (Primary Key).
    -   `leagueId`: Identifier for the league (Foreign Key).
    -   `propName`: Name of the property.

### 27. LeaguePropsInfo

-   **Description**: This table stores additional information about league properties.
-   **Columns**:
    -   `id`: Unique identifier for the league property info (Primary Key).
    -   `leaguePropId`: Identifier for the league property (Foreign Key).
    -   `propValue`: Value of the property.

## Relationships

-   **BetMarkets** to **BetTargets**: Many-to-One relationship. Each bet market can be associated with one bet target, but a bet target can have multiple bet markets.
-   **BetMarkets** to **Bookies**: Many-to-One relationship. Each bet market can be offered by one bookmaker, but a bookmaker can offer multiple bet markets.
-   **Users** to **Bets**: One-to-Many relationship. Each user can place multiple bets, but each bet is associated with one user.
-   **Bets** to **BetMarkets**: Many-to-One relationship. Each bet is associated with one bet market, but a bet market can have multiple bets.
-   **Users** to **Transactions**: One-to-Many relationship. Each user can have multiple transactions, but each transaction is associated with one user.

## Key Functions

### BetMarkets Functions

-   `getBetMarketByGameId(db, gameId)`: Retrieves all bet markets associated with a specific game.
-   `getUniqueMarketTypesByGame(db, gameId)`: Retrieves all unique market types for a specific game.
-   `insertBetMarket(db, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)`: Inserts a new bet market into the database.
-   `insertFullBetMarket(db, id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)`: Inserts a bet market with a specified ID.
-   `updateBetMarket(db, betMarketId, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)`: Updates an existing bet market.
-   `deleteBetMarket(db, betMarketId)`: Deletes a bet market by its ID.

### Users Functions

-   `getUserById(db, userId)`: Retrieves user information by their ID.
-   `createUser(db, username, email, passwordHash)`: Creates a new user in the database.
-   `updateUser(db, userId, username, email, passwordHash)`: Updates user information.
-   `deleteUser(db, userId)`: Deletes a user by their ID.

### Bets Functions

-   `getBetsByUserId(db, userId)`: Retrieves all bets placed by a specific user.
-   `placeBet(db, userId, betMarketId, stake, potentialPayout, status, placedAt)`: Places a new bet.
-   `updateBetStatus(db, betId, status)`: Updates the status of a bet.
-   `deleteBet(db, betId)`: Deletes a bet by its ID.

### Transactions Functions

-   `getTransactionsByUserId(db, userId)`: Retrieves all transactions for a specific user.
-   `createTransaction(db, userId, amount, transactionType, timestamp)`: Creates a new transaction.
-   `deleteTransaction(db, transactionId)`: Deletes a transaction by its ID.

## Additional Folders

### bet-general

This folder contains files related to general betting functionalities, such as managing bet types and odds.

### betslips

This folder includes files that handle bet slips, including creating, updating, and managing user bet slips.

### data

This folder manages data operations, including data retrieval and manipulation for various betting-related datasets.

### general

This folder includes general utility functions or configurations that support overall database operations.

### insights

This folder generates insights or analytics based on betting data, including statistical analysis or reporting functions.

### user-specific

This folder manages user-specific data and operations, such as user profiles, preferences, and history.

### db

This folder contains database-related files, including schema definitions, migrations, and database utility functions.

## Conclusion

This schema documentation serves as a reference for developers working with the BetSmart project, providing clarity on the database structure and the functions available for interacting with the data.
