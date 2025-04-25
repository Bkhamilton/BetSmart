# New Bet Tab - Screens Documentation

This document provides an overview of the screens available in the New Bet tab of the Sports Bet Tracking app. Each screen is designed to facilitate the process of creating and managing bet slips.

---

## 1. **Select Game**

### **File Path**: `app/(tabs)/newBet/selectGame.js`

### **Purpose**:

The `SelectGame` screen allows users to choose a game and league for placing bets.

### **Key Features**:

-   **Game List**: Displays a list of games for the selected league and date.
-   **League Selection**: Allows users to select a league using a modal or slider.
-   **Date Picker**: Enables users to filter games by date.
-   **Bet Slip Banner**: Provides quick access to the current bet slip.
-   **Bookie Selection**: Allows users to choose a bookie for the bet slip.

### **Usage**:

This is the first step in the betting process. Users select a game and league before proceeding to the next screen.

---

## 2. **Bet Details**

### **File Path**: `app/(tabs)/newBet/betDetails.js`

### **Purpose**:

The `BetDetails` screen allows users to select specific betting props and finalize their bet slip.

### **Key Features**:

-   **League Props**: Displays a slider with available betting props for the selected league.
-   **Prop Details**: Shows detailed information about the selected prop.
-   **Bet Slip Management**: Allows users to add props to the bet slip and view the current bet slip.
-   **Bookie Selection**: Provides an option to change the bookie for the bet slip.

### **Usage**:

This is the second step in the betting process. Users select props and confirm their bet slip.

---

## 3. **New Bet Layout**

### **File Path**: `app/(tabs)/newBet/_layout.js`

### **Purpose**:

The `NewBetLayout` file defines the navigation structure for the New Bet tab, linking the `SelectGame` and `BetDetails` screens.

### **Key Features**:

-   **Context Integration**: Wraps the screens with the `BetContextProvider` to manage bet-related state.
-   **Screen Navigation**: Configures navigation between `selectGame` and `betDetails` screens.
-   **Custom Animations**: Adds custom animations for screen transitions.

### **Usage**:

This layout ensures that all screens in the New Bet tab share the same context and navigation structure.

---

## General Notes

-   **Navigation**: The `NewBetLayout` file manages navigation between the screens in the New Bet tab.
-   **Context Integration**: Both screens rely on the `BetContext` for managing bet-related state.
-   **Modularity**: Each screen is designed to handle a specific part of the betting process, ensuring a clean and organized user experience.

For further details, refer to the respective screen files.
