# Hooks Documentation

This document provides an overview of all the custom hooks used in the application and their functionality.

---

## **useAuthState**

Manages authentication state, including login, signup, and logout functionality.

### Exposed Functions and Variables:

-   `loginModalVisible`, `signUpModalVisible`: Control visibility of modals.
-   `login(username, password)`: Logs in a user.
-   `signUp(username, email, name, password)`: Signs up a new user.
-   `signOutUser(userId)`: Signs out the user and ends the session.
-   `handleSignUp()`: Switches from login modal to signup modal.

---

## **useConfirmationState**

Handles confirmation modals and double confirmation logic.

### Exposed Functions and Variables:

-   `confirmationModalVisible`, `doubleConfirmModalVisible`: Control modal visibility.
-   `startConfirmation(message)`: Opens a confirmation modal with a message.
-   `confirmAction(message)`: Handles single confirmation logic.
-   `confirmDoubleAction()`: Handles double confirmation logic.

---

## **useHookBetDetails**

Manages bet details for a specific league.

### Exposed Functions and Variables:

-   `leagueProps`, `leaguePropInfo`: Stores league properties and their details.
-   `curLeagueProp`: Currently selected league property.
-   `selectLeagueProp(prop)`: Updates the selected league property.

---

## **useDatabaseFuncs**

Provides database-related utility functions.

### Exposed Functions:

-   `deleteUserBetSlip(betSlip, userId)`: Deletes a bet slip and updates the user's balance.
-   `clearBettingData(user)`: Clears all betting data for a user.
-   `deleteAccount(user, signOut)`: Deletes a user account after clearing all data.

---

## **useHookBetHistory**

Manages the user's bet history.

### Exposed Functions and Variables:

-   `selectedType`: Tracks whether "Open" or "Settled" bets are selected.
-   `betSlips`: Stores the list of bet slips.
-   `changeType(type)`: Changes the selected bet type.
-   Automatically fetches open or settled bets based on `selectedType`.

---

## **useHookBetPreferences**

Manages user betting preferences.

### Exposed Functions and Variables:

-   `preferences`: Stores user preferences (e.g., bankroll, risk tolerance).
-   `updatePreferences(preferences)`: Updates preferences in the database.

---

## **useHookData**

Handles data analytics for the Data Tab.

### Exposed Functions and Variables:

-   `selectedTime`: Tracks the selected time range (e.g., 7D, 1M).
-   `data`: Stores analytics data (e.g., profit, win rate).
-   `selectTime(timeRange)`: Updates the selected time range.
-   `refreshData()`: Refreshes the analytics data.

---

## **useHookHome**

Manages the Home screen state.

### Exposed Functions and Variables:

-   `confirmModalVisible`, `chooseBookieModalVisible`, `profileOptionsModalVisible`: Control modal visibility.
-   `betSlips`, `weeklyBets`: Store open and weekly bet slips.
-   `onConfirmBetSlip(betSlip)`: Confirms a bet slip and updates the state.

---

## **useHookInsightsPage**

Handles insights data for the Insights Tab.

### Exposed Functions and Variables:

-   `streak`: Tracks the user's current streak (hot, cold, none).
-   `cycleStreak()`: Cycles through streak states.
-   `betsPlaced`, `betsWon`, `profit`, `topBet`: Store insights data for the last 7 days.

---

## **useHookNewBet**

Manages the creation of new bets.

### Exposed Functions and Variables:

-   `betSlipModalVisible`, `chooseBookieModalVisible`: Control modal visibility.
-   `selectBookie(bookie)`: Selects a bookie for the bet slip.
-   `removeProp(bet, leg)`: Removes a leg from the bet slip.
-   `confirmBet(wager, winnings, bookieId)`: Confirms the bet slip.

---

## **useHookProfilePage**

Placeholder hook for managing the Profile Page.

---

## **useHookSelectGame**

Handles game selection for placing bets.

### Exposed Functions and Variables:

-   `date`: Tracks the selected date.
-   `header`: Displays the current league or "Place Bet".
-   `selectLeagueModal`: Controls league selection modal visibility.
-   `selectLeague(newLeague)`: Selects or deselects a league.
-   Automatically fetches games for the selected date.

---

## **useHookSettings**

Manages settings modals.

### Exposed Functions and Variables:

-   `helpModalVisible`, `aboutModalVisible`, `privacyModalVisible`: Control modal visibility.
-   `handleHelpModal()`, `handleAboutModal()`, `handlePrivacyModal()`: Toggle respective modals.

---

## **useHookTransactions**

Fetches and manages user transaction data.

### Exposed Functions and Variables:

-   `transactions`: Stores the list of user transactions.

---

## **useOptionsState**

Handles options modals for user interactions.

### Exposed Functions and Variables:

-   `optionsModalVisible`: Controls modal visibility.
-   `handleOpenOptions(target, options, handleResponse)`: Opens the options modal and handles the selected option.

---

## **useRouting**

Manages navigation between screens.

### Exposed Functions:

-   `handleProfilePage()`, `handleBetHistory()`, `handleSettings()`: Navigate to respective screens.
-   `handleSelectGame({ game })`: Navigates to the game selection screen.
-   `handleCloseBetDetails()`: Closes the bet details screen.

---

## **useTheme**

Provides theme-based colors for the application.

### Exposed Variables:

-   `themeColors`: Contains color definitions based on the current theme.
-   `bookieColors`, `bookieBorderColors`: Provide colors for specific bookies.

---

## **useUserBalDataState**

Manages user balance and transaction data.

### Exposed Functions and Variables:

-   `addBookieModalVisible`, `transactionModalVisible`: Control modal visibility.
-   `addBookie(bookie)`: Adds a new bookie to the user's balance.
-   `confirmTransaction(bookieId, title, initialAmount, transactionAmount, updatedBalance)`: Confirms a transaction and updates the balance.
