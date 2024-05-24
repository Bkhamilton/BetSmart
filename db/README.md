# Database Tables

# API

## BetMarkets

The `BetMarkets` table stores information about individual betting lines.

| Column    | Data Type | Description                                                            |
| --------- | --------- | ---------------------------------------------------------------------- |
| id        | INTEGER   | Primary key, auto-incrementing unique identifier for each betting line |
| formatId  | INTEGER   | Foreign key referencing the `BetFormats` table (not null)              |
| date      | TEXT      | Date of the betting line (not null)                                    |
| odds      | TEXT      | Odds for the betting line (not null)                                   |
| betAmount | REAL      | Amount of the bet placed (not null)                                    |
| winnings  | REAL      | Potential winnings for the bet                                         |
| userId    | INTEGER   | Foreign key referencing the `Users` table (not null)                   |

# USER-SPECIFIC

## Users

The `Users` table stores user information for authentication and identification purposes.

| Column   | Data Type | Description                                                    |
| -------- | --------- | -------------------------------------------------------------- |
| Id       | INTEGER   | Primary key, auto-incrementing unique identifier for each user |
| Name     | TEXT      | User's full name (not null)                                    |
| Username | TEXT      | User's unique username (not null)                              |
| Password | TEXT      | User's password (not null)                                     |

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

| Column           | Data Type | Description                                                                  |
| ---------------- | --------- | ---------------------------------------------------------------------------- |
| id               | INTEGER   | Primary key, auto-incrementing unique identifier for each leg                |
| participantBetId | INTEGER   | Foreign key referencing the `ParticipantBets` table (not null)               |
| legType          | TEXT      | Type of the leg (e.g., 'Player Points', 'Moneyline') (not null)              |
| betTargetId      | INTEGER   | Foreign key referencing the `BetTargets` table for the bet target (not null) |
| stat             | TEXT      | Statistic or metric associated with the leg                                  |
| line             | REAL      | Line or value for the statistic or metric                                    |
| overUnder        | TEXT      | 'over' or 'under' for the line or value                                      |

## BetSlips

TO BE ADDED LATER

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

# GENERAL

## Teams

The `Teams` table stores information about sports teams.

| Column       | Data Type | Description                                                    |
| ------------ | --------- | -------------------------------------------------------------- |
| id           | INTEGER   | Primary key, auto-incrementing unique identifier for each team |
| teamName     | TEXT      | Name of the team (not null)                                    |
| abbreviation | TEXT      | Abbreviation or short name of the team (not null)              |
| logoUrl      | TEXT      | URL or path to the team's logo                                 |
| city         | TEXT      | City where the team is based                                   |
| state        | TEXT      | State or province where the team is based                      |
| country      | TEXT      | Country where the team is based                                |

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

| Column   | Data Type | Description                                                      |
| -------- | --------- | ---------------------------------------------------------------- |
| id       | INTEGER   | Primary key, auto-incrementing unique identifier for each season |
| leagueId | INTEGER   | Foreign key referencing the `Leagues` table (not null)           |
| season   | TEXT      | Name or identifier of the season (not null)                      |

## Games

TO BE ADDED LATER

## Bookies

TO BE ADDED LATER

