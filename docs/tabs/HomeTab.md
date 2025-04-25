# Home Tab - Screens Documentation

This document provides an overview of the screens available in the Home tab of the Sports Bet Tracking app. Each screen is designed to provide users with insights into their betting activity and manage their bets.

---

## 1. **Home Screen**

### **File Path**: `app/(tabs)/index.js`

### **Purpose**:

The `HomeScreen` serves as the main dashboard for the app, providing an overview of the user's betting activity, financial transactions, and weekly performance.

### **Key Features**:

-   **Profit Dashboard**: Displays the user's profit and loss summary, with options to view transactions or add bookies.
-   **Open Bets**: Lists the user's active bet slips with options to confirm or edit them.
-   **Weekly Bet Review**: Provides a summary of the user's betting performance over the past week.
-   **Bank Review**: Displays financial transactions and allows users to manage bookies.
-   **Modals**:
    -   **Login and Sign-Up**: Allows users to log in or create an account.
    -   **Transaction Modal**: Handles deposit and withdrawal transactions.
    -   **Add Bookie**: Enables users to add new bookies.
    -   **Confirm Bet Slip**: Confirms the details of a bet slip.
    -   **Profile Options**: Provides options for managing the user's profile.
    -   **Choose Bookie**: Allows users to select a bookie for transactions or bets.
    -   **Location Modal**: Displays location-related information for betting legality.

### **Usage**:

This is the default screen for the Home tab, providing a comprehensive overview of the user's betting activity and financial status.

---

## General Notes

-   **Navigation**: The Home tab is the default entry point for the app and provides access to other tabs and features.
-   **Context Integration**: The `HomeScreen` relies on multiple contexts (e.g., `UserContext`) for managing user data and state.
-   **Modularity**: Each component and modal is designed to handle a specific aspect of the user's betting activity, ensuring a clean and organized user experience.

For further details, refer to the `index.js` file.
