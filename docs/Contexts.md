# Sports Bet Tracking App - Contexts Documentation

This document provides an overview of the various context files used in the Sports Bet Tracking app. Each context is designed to manage specific aspects of the app's state and functionality.

---

## 1. **UserContext**

### **File Path**: `contexts/UserContext.tsx`

### **Purpose**:

The `UserContext` manages user-related data, including user information, preferences, balance, and location verification.

### **Key Features**:

-   **User Management**: Tracks the currently signed-in user and their session.
-   **Balance Management**: Fetches and updates the user's balance across different bookies.
-   **Preferences**: Allows users to set and update preferences like bankroll, daily limits, and preferred leagues.
-   **Location Verification**: Verifies if the user is in a legal location for betting.
-   **Signed-In State**: Tracks whether the user is signed in or not.

### **Usage**:

Wrap the app or specific components with `UserContextProvider` to access user-related data and methods.

---

## 2. **SupabaseContext**

### **File Path**: `contexts/SupabaseContext.tsx`

### **Purpose**:

The `SupabaseContext` provides access to the Supabase client and manages data fetched from the Supabase database.

### **Key Features**:

-   **Supabase Client**: Configures and provides the Supabase client for database operations.
-   **Leagues Management**: Fetches and stores a list of leagues from the Supabase database.

### **Usage**:

Wrap components that require access to Supabase data with `SupabaseContextProvider`.

---

## 3. **DBContext**

### **File Path**: `contexts/DBContext.tsx`

### **Purpose**:

The `DBContext` manages access to the SQLite database and provides data related to bookies and leagues.

### **Key Features**:

-   **Database Access**: Provides the SQLite database instance.
-   **Bookies and Leagues**: Fetches and stores lists of bookies and leagues from the database.

### **Usage**:

Wrap components that need access to database-related data with `DBContextProvider`.

---

## 4. **BetContext**

### **File Path**: `contexts/BetContext/BetContext.tsx`

### **Purpose**:

The `BetContext` manages the state and operations related to creating and managing bet slips.

### **Key Features**:

-   **Bet Slip Management**: Tracks the current bet slip, including bets and legs.
-   **Game and League Selection**: Allows users to select games and leagues for betting.
-   **Bet Confirmation**: Handles the process of confirming and saving a bet slip to the database.
-   **Bookie Selection**: Tracks the selected bookie for the bet slip.

### **Usage**:

Wrap components involved in the betting process with `BetContextProvider`.

---

## 5. **RootLayout Contexts**

### **File Path**: `app/_layout.tsx`

### **Purpose**:

The root layout combines multiple contexts (`UserContext`, `DBContext`, `SupabaseContext`) to provide a unified state management system for the app.

### **Key Features**:

-   **Context Composition**: Combines all major contexts to ensure seamless state sharing across the app.
-   **Database Initialization**: Initializes the SQLite database on app startup.

### **Usage**:

This is the main entry point for the app. All components are wrapped with the necessary providers here.

---

## 6. **NewBetLayout Context**

### **File Path**: `app/(tabs)/newBet/_layout.js`

### **Purpose**:

The `NewBetLayout` is a specialized layout for managing the betting process. It uses the `BetContext` to handle bet-related operations.

### **Key Features**:

-   **Bet Context Integration**: Provides the `BetContext` to components within the "New Bet" tab.
-   **Screen Navigation**: Manages navigation between screens like `selectGame` and `betDetails`.

### **Usage**:

Used specifically for the "New Bet" tab in the app.

---

## General Notes

-   **Context Wrapping**: Always ensure that components requiring context data are wrapped with the appropriate provider.
-   **State Management**: Each context is designed to manage a specific part of the app's state, ensuring modularity and maintainability.
-   **Error Handling**: Implement error handling in context methods to ensure smooth user experience.

For further details, refer to the respective context files.
