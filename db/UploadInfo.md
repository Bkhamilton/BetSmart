# Steps to insert General Data into DB

## functions to import:

```javascript
insertBookie, getBookieByName from db/general/Bookies
insertLeague, getLeagueByName from db/general/Leagues
insertTeam                    from db/general/Teams
insertSeason, getSeasonByDate from db/general/Seasons
```

### 1. Insert Bookies

`insertBookie(db, name, description)`

manual inserts

```javascript
insertBookie(db, "DraftKings", "DraftKings Sportsbook");
insertBookie(db, "FanDuel", "FanDuel Sportsbook");
```

The description isn't important right now. You can add as many bookies as you want, but make sure to add these two, and preferably add them first.

### 2. Insert Leagues

`insertLeague(db, leagueName, sport, description)`

manual inserts

```javascript
insertLeague(db, "NBA", "Basketball", "National Basketball Association");
insertLeague(db, "NFL", "Football", "National Football League");
// add NCAAB, MLB, MLS, NHL, PGA, UFC
```

for the 8 leagues in the sportsData array found in `data/exampleTeamData.js`

### 3. Insert Seasons

`insertSeason(db, leagueId, season, games, description, seasonType, startDate, endDate)`

manual inserts

getLeagueByName to get league id, use leagueId to insert seasons for current sports

```javascript
insertSeason(
  db,
  getLeagueByName("NBA").id,
  "2023-2024",
  82,
  "2023-2024 NBA Season",
  "Regular Season",
  "2023-10-24",
  "2022-04-14"
);
insertSeason(
  db,
  getLeagueByName("NBA").id,
  "2023-2024",
  28,
  "2023-2024 NBA Playoffs",
  "Playoffs",
  "2024-04-20",
  "2024-06-23"
);
```

This gets you the Regular Season and Playoffs for the NBA. Doing this for other sports will allow you to query for other sports

### 4. Insert Teams

`insertTeam(db, teamName, abbreviation, leagueId)`

`data/teamAbbrevations.js` holds all of the teamNames and abbreviations for each sport

```javascript
Object.entries(nbaTeamAbbreviations).map(([key, value]) => {
insertTeam(db, key, value, getLeagueByName("NBA).id)
});
```

This function takes each entry in nbaTeamAbbreviations and inserts the key and value into the Teams table.

change `nbaTeamAbbreviations` to another sport (`mlbTeamAbbreivations`) and change the string in `getLeagueByName("MLB")` to upload each team for each sport. We have NBA, MLB, NHL, and NFL team abbreviation objects

### 5. Inserting Games

Once all 4 of the previous steps has been followed, reloading the app and going to the Place Bets Page should now properly display all of the games for the NBA, NHL, and MLB. These are the only teams that I am interested in right now to limit API calls.

# Steps to insert User-Specific Data into DB

## functions to import:

```javascript
insertUser, getUser from db/user-specific/Users
insertBalance       from db/user-specific/Balance
```

### 1. Insert User

`insertUser(db, name, email, username, password)`

manual insert

```javascript
insertUser(db, "NAME", "EMAIL", "USERNAME", "PASSWORD");
```

I only have myself inserted as a user, I have the default User hardcoded into the UserContext Context.

### 2. Insert Balance

`insertBalance(db, bookieId, balance, userId);`

manual inserts

```javascript
insertBalance(db, getBookieByName("DraftKings").id, 100, getUser("username"));
insertBalance(db, getBookieByName("FanDuel").id, 100, getUser("username"));
```

This adds $100 to your current balance for FanDuel and DraftKings

MORE

```javascript
const addLeaguePropInfo = () => {
  getLeagueByName(db, "NBA").then((league) => {
    NBAcategories.forEach((category) => {
      category.info.map((info) => {
        insertLeaguePropInfo(db, league.id, category.title, info);
      });
    });
  });
  getLeagueByName(db, "NHL").then((league) => {
    NHLcategories.forEach((category) => {
      category.info.map((info) => {
        insertLeaguePropInfo(db, league.id, category.title, info);
      });
    });
  });
  getLeagueByName(db, "MLB").then((league) => {
    MLBcategories.forEach((category) => {
      category.info.map((info) => {
        insertLeaguePropInfo(db, league.id, category.title, info);
      });
    });
  });
};

insertBetType(db, "Main", "Main Game Lines");

insertBetFormat(db, "Single", "Single bet").then(() => {
  insertBetFormat(db, "Parlay", "Parlay bet").then(() => {
    insertBetFormat(db, "Teaser", "Teaser bet").then(() => {
      insertBetFormat(db, "Round Robin", "Round Robin bet").then(() => {
        console.log("Bet formats inserted");
      });
    });
  });
});
```
