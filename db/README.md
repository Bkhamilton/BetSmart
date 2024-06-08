# Database Tables

# API

## BetMarkets

The `BetMarkets` table stores information about individual betting lines.

| Column      | Data Type | Description                                                            |
| ----------- | --------- | ---------------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each betting line |
| gameId      | TEXT      | Foreign key referencing the `Games` table (not null)                   |
| marketType  | TEXT      | Type of the betting market (not null)                                  |
| value       | REAL      | Value associated with the betting market (not null)                    |
| odds        | TEXT      | Odds for the betting line                                              |
| overUnder   | TEXT      | 'over' or 'under' for the line or value                                |
| betTargetId | INTEGER   | Foreign key referencing the `BetTargets` table (not null)              |
| bookieId    | INTEGER   | Foreign key referencing the `Bookies` table (not null)                 |

# USER-SPECIFIC

## Users

The `Users` table stores user information for authentication and identification purposes.

| Column   | Data Type | Description                                                    |
| -------- | --------- | -------------------------------------------------------------- |
| id       | INTEGER   | Primary key, auto-incrementing unique identifier for each user |
| name     | TEXT      | User's full name                                               |
| email    | TEXT      | User's email address                                           |
| username | TEXT      | User's unique username (not null)                              |
| password | TEXT      | User's password (not null)                                     |

## Balance

The `Balance` table stores the balance information for each user and bookie combination.

| Column  | Data Type | Description                                |
| ------- | --------- | ------------------------------------------ |
| Bookie  | TEXT      | Primary key, name of the bookie (not null) |
| Balance | REAL      | User's balance with the bookie (not null)  |
| UserID  | INTEGER   | Foreign key referencing the `Users` table  |

## ParticipantBets

The `ParticipantBets` table stores information about individual participant bets within a betting line.

| Column        | Data Type | Description                                                                 |
| ------------- | --------- | --------------------------------------------------------------------------- |
| id            | INTEGER   | Primary key, auto-incrementing unique identifier for each participant bet   |
| bettingLineId | INTEGER   | Foreign key referencing the `BettingLines` table (not null)                 |
| sport         | TEXT      | Sport associated with the participant bet (not null)                        |
| homeTeamId    | INTEGER   | Foreign key referencing the `BetTargets` table for the home team (not null) |
| awayTeamId    | INTEGER   | Foreign key referencing the `BetTargets` table for the away team (not null) |
| odds          | TEXT      | Odds for the participant bet (not null)                                     |

## Legs

The `Legs` table stores information about individual legs or selections within a participant bet.

| Column           | Data Type | Description                                                              |
| ---------------- | --------- | ------------------------------------------------------------------------ |
| id               | INTEGER   | Primary key, auto-incrementing unique identifier for each leg            |
| participantBetId | INTEGER   | Foreign key referencing the `ParticipantBets` table (not null)           |
| betMarketId      | INTEGER   | Foreign key referencing the `BetMarkets` table for the market (not null) |

## BetSlips

The `BetSlips` table stores information about individual bet slips.

| Column    | Data Type | Description                                                        |
| --------- | --------- | ------------------------------------------------------------------ |
| id        | INTEGER   | Primary key, auto-incrementing unique identifier for each bet slip |
| formatId  | INTEGER   | Foreign key referencing the `BetFormats` table (not null)          |
| date      | TEXT      | Date of the bet slip (not null)                                    |
| odds      | TEXT      | Odds for the bet slip (not null)                                   |
| betAmount | REAL      | Amount of the bet (not null)                                       |
| winnings  | REAL      | Amount of winnings for the bet slip                                |
| userId    | INTEGER   | Foreign key referencing the `Users` table (not null)               |
| bookieId  | INTEGER   | Foreign key referencing the `Bookies` table (not null)             |

## Transactions

The `Transactions` table stores information about financial transactions between users and bookies.

| Column          | Data Type | Description                                                           |
| --------------- | --------- | --------------------------------------------------------------------- |
| id              | INTEGER   | Primary key, auto-incrementing unique identifier for each transaction |
| bookieId        | INTEGER   | Foreign key referencing the `Bookies` table (not null)                |
| userId          | INTEGER   | Foreign key referencing the `Users` table (not null)                  |
| transactionType | TEXT      | Type of the transaction ('Deposit' or 'Withdraw') (not null)          |
| initialBalance  | REAL      | Initial balance before the transaction (not null)                     |
| amount          | REAL      | Amount of the transaction (not null)                                  |
| finalBalance    | REAL      | Final balance after the transaction (not null)                        |
| timestamp       | TEXT      | Timestamp of the transaction (not null)                               |
| description     | TEXT      | Description or additional details about the transaction               |

## Bonuses

The `Bonuses` table stores information about bonuses given to users by bookies.

| Column      | Data Type | Description                                                     |
| ----------- | --------- | --------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each bonus |
| bookieId    | INTEGER   | Foreign key referencing the `Bookies` table (not null)          |
| userId      | INTEGER   | Foreign key referencing the `Users` table (not null)            |
| bonusType   | TEXT      | Type of the bonus (not null)                                    |
| bonusAmount | REAL      | Amount of the bonus (not null)                                  |
| timestamp   | TEXT      | Timestamp of when the bonus was given (not null)                |
| description | TEXT      | Description or additional details about the bonus               |

# BET-GENERAL

## BetTargets

The `BetTargets` table stores information about bet targets, which can be teams or players.

| Column     | Data Type | Description                                                          |
| ---------- | --------- | -------------------------------------------------------------------- |
| id         | INTEGER   | Primary key, auto-incrementing unique identifier for each bet target |
| targetType | TEXT      | Type of the bet target ('Player' or 'Team') (not null)               |
| targetName | TEXT      | Name of the bet target (not null)                                    |
| teamId     | INTEGER   | Foreign key referencing the `Teams` table, for player targets        |

## BetTypes

The `BetTypes` table stores information about different types of bets.

| Column      | Data Type | Description                                                          |
| ----------- | --------- | -------------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each bet type   |
| betType     | TEXT      | Name of the bet type (e.g., 'Player Points', 'Moneyline') (not null) |
| description | TEXT      | Description or additional details about the bet type                 |

## BetFormats

The `BetFormats` table stores information about different bet formats or structures.

| Column      | Data Type | Description                                                          |
| ----------- | --------- | -------------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each bet format |
| formatName  | TEXT      | Name of the bet format (e.g., 'Parlay', 'Single') (not null, unique) |
| description | TEXT      | Description or additional details about the bet format               |

## LeagueProps

The `LeagueProps` table stores additional properties or attributes associated with each league.

| Column   | Data Type | Description                                                        |
| -------- | --------- | ------------------------------------------------------------------ |
| id       | INTEGER   | Primary key, auto-incrementing unique identifier for each property |
| leagueId | INTEGER   | Foreign key referencing the `Leagues` table (not null)             |
| propName | TEXT      | Name of the property (not null)                                    |

# GENERAL

## Teams

The `Teams` table stores information about sports teams.

| Column       | Data Type | Description                                                    |
| ------------ | --------- | -------------------------------------------------------------- |
| id           | INTEGER   | Primary key, auto-incrementing unique identifier for each team |
| teamName     | TEXT      | Name of the team (not null)                                    |
| abbreviation | TEXT      | Abbreviation or short name of the team (not null)              |
| logoUrl      | TEXT      | URL or path to the team's logo                                 |

## Leagues

The `Leagues` table stores information about sports leagues.

| Column      | Data Type | Description                                                      |
| ----------- | --------- | ---------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each league |
| leagueName  | TEXT      | Name of the league (not null)                                    |
| sport       | TEXT      | Sport the league is associated with (not null)                   |
| description | TEXT      | Description or additional details about the league               |

## Seasons

The `Seasons` table stores information about seasons for each league.

| Column      | Data Type | Description                                                                      |
| ----------- | --------- | -------------------------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each season                 |
| leagueId    | INTEGER   | Foreign key referencing the `Leagues` table (not null)                           |
| season      | TEXT      | Name or identifier of the season (not null)                                      |
| games       | INTEGER   | Number of games in the season (not null)                                         |
| description | TEXT      | Description or additional details about the season                               |
| seasonType  | TEXT      | Type of the season (e.g., 'Pre-Season', 'Regular Season', 'Playoffs') (not null) |
| startDate   | DATE      | Start date of the season (not null)                                              |
| endDate     | DATE      | End date of the season (not null)                                                |

## Games

The `Games` table stores information about individual games.

| Column     | Data Type | Description                                                            |
| ---------- | --------- | ---------------------------------------------------------------------- |
| id         | INTEGER   | Primary key, auto-incrementing unique identifier for each game         |
| gameId     | TEXT      | Unique identifier for the game (not null)                              |
| seasonId   | INTEGER   | Foreign key referencing the `Seasons` table (not null)                 |
| date       | TEXT      | Date of the game (not null)                                            |
| timestamp  | TEXT      | Timestamp of the game (not null)                                       |
| homeTeamId | INTEGER   | Foreign key referencing the `Teams` table for the home team (not null) |
| awayTeamId | INTEGER   | Foreign key referencing the `Teams` table for the away team (not null) |

## Bookies

The `Bookies` table stores information about bookies.

| Column      | Data Type | Description                                                      |
| ----------- | --------- | ---------------------------------------------------------------- |
| id          | INTEGER   | Primary key, auto-incrementing unique identifier for each bookie |
| name        | TEXT      | Name of the bookie (not null)                                    |
| description | TEXT      | Description or additional details about the bookie               |
