## Data
The Data page will be an in depth breakdown of the data collected in this app, and breakdowns into what trends and habits have the best and worst outcomes

## To Add
## Data Visualization Ideas

1. **Profit/Loss Trend**: A line chart or area chart that shows the user's overall profit or loss over time.

2. **Bet Type Analysis**: A pie chart or stacked bar chart that breaks down the user's bets by type (e.g., moneyline, spread, over/under, parlays, teasers, etc.).

3. **Sport/League Breakdown**: A bar chart or stacked bar chart that shows the user's performance across different sports or leagues.

4. **Handicapping Analysis**: Charts or graphs that analyze the user's performance based on different handicapping factors, such as home/away teams, favorite/underdog status, point spreads, over/under totals, etc.

5. **Bankroll Management**: A line chart or area chart that tracks the user's bankroll (available funds for betting) over time.

6. **ROI (Return on Investment)**: A bar chart or line chart that displays the user's ROI for different bet types, sports, or time periods.

7. **Odds Distribution**: A histogram or frequency distribution chart that shows the distribution of odds for the user's winning and losing bets.

8. **Streak Analysis**: Charts or graphs that visualize the user's longest winning and losing streaks, as well as the frequency and duration of hot or cold streaks.

9. **Time/Day Analysis**: Charts or graphs that analyze the user's performance based on the time of day, day of the week, or specific events (e.g., primetime games, weekends, playoffs, etc.).

10. **Correlation Analysis**: Scatter plots or correlation matrices that explore relationships between different factors (e.g., bet type, odds, team statistics, weather conditions, etc.) and the user's betting outcomes.
***

## Profile
The Profile page will be used to see general player information, as well as the settings and other important User Info
## To Add
## Profile Tab Features

1. **Account Settings**:
   - Change password
   - Update email address
   - Manage notification preferences (email, push notifications, etc.)
   - Enable or disable two-factor authentication

2. **Personal Information**:
   - Edit personal details (name, date of birth, location, etc.)
   - Add a short bio or description

3. **Betting History**:
   - View a detailed log of all past bets (sport, bet type, odds, result, etc.)
   - Filter and sort betting history by date, sport, bet type, etc.
   - Export betting history as a CSV or PDF file

4. **Favorite Teams/Leagues**:
   - Allow users to select and save their favorite teams or leagues
   - Display upcoming games or events for the user's favorite teams/leagues

5. **Betting Preferences**:
   - Set default bet types (moneyline, spread, over/under, etc.)
   - Set preferred odds format (decimal, American, fractional)
   - Set default risk level or unit size for bets

6. **Bankroll Management**:
   - Track and manage the user's bankroll (deposit, withdraw, view balance)
   - Set bankroll limits or alerts (e.g., notify when bankroll drops below a certain threshold)

7. **Achievements/Badges**:
   - Display achievements or badges earned based on betting activities or milestones
   - Gamify the experience by offering challenges or goals to unlock new achievements

8. **Social Features**:
   - Connect with friends or other users
   - Follow other users and view their recent bets or activity
   - Share or discuss bets and predictions with others

9. **Privacy Settings**:
   - Control the visibility of personal information, betting history, and activity
   - Manage who can view or follow the user's profile

10. **Support/Help**:
    - Access to FAQs, tutorials, or support resources
    - Submit support tickets or request assistance


```markdown
# Referencing Markets for a Given Game ID

To reference the different markets available for a specific game, you can use the `game_id` property and the `markets` array. Here's how you can access the moneyline, spread, and total score over/under markets:

## Moneyline

The moneyline market is represented by the string `"moneyline"` in the `markets` array. To access it, you can loop through the array and check for this string:

```javascript
const gameID = "7b36bc0c154aacccbadc351a390f6dee";
const data = {
  "game_id": "7b36bc0c154aacccbadc351a390f6dee",
  "markets": [
    // ...
    { "name": "moneyline" },
    // ...
  ]
};

const moneylineMarket = data.markets.find(market => market.name === "moneyline");
```

## Spread

The spread market is represented by the string `"spread"` in the `markets` array. You can access it similarly to the moneyline market:

```javascript
const spreadMarket = data.markets.find(market => market.name === "spread");
```

## Total Score Over/Under

The total score over/under market is represented by the string `"total_over_under"` in the `markets` array:

```javascript
const totalOverUnderMarket = data.markets.find(market => market.name === "total_over_under");
```

## Alternative Markets

In addition to the main markets, the data also includes alternative markets, such as `"moneyline_regulation"`, `"spread_alternate"`, and `"total_over_under_alternate"`. You can access these markets in the same way as the main markets:

```javascript
const alternativeMoneylineMarket = data.markets.find(market => market.name === "moneyline_regulation");
const alternativeSpreadMarket = data.markets.find(market => market.name === "spread_alternate");
const alternativeTotalOverUnderMarket = data.markets.find(market => market.name === "total_over_under_alternate");
```

With these examples, you should be able to reference the moneyline, spread, and total score over/under markets for a given `gameID` from the provided JSON data.
```
