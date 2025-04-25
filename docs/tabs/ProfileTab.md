# Profile Tab - Screens Documentation

This document provides an overview of the screens available in the Profile tab of the Sports Bet Tracking app. Each screen is designed to manage specific aspects of the user's profile and preferences.

---

## 1. **Profile Page**

### **File Path**: `app/(tabs)/profile/profilePage.js`

### **Purpose**:

The `ProfilePage` screen serves as the main hub for user profile information, including favorites, achievements, and active bookies.

### **Key Features**:

-   **Profile Information**: Displays the user's main profile details.
-   **User Favorites**: Highlights the user's favorite players or teams.
-   **Active Bookies**: Shows the user's active bookies and allows adding or removing bookies.
-   **Betting Preferences**: Displays and manages the user's betting preferences.
-   **Achievements**: Lists the user's achievements.
-   **Bankroll Management**: Provides tools for managing the user's bankroll.

---

## 2. **Settings**

### **File Path**: `app/(tabs)/profile/settings.js`

### **Purpose**:

The `Settings` screen allows users to manage their account settings, privacy preferences, and app-related options.

### **Key Features**:

-   **Account Management**: Provides options to log out, delete the account, or clear user data.
-   **Privacy Settings**: Allows users to configure privacy-related preferences.
-   **Help and About**: Displays help and about modals for app support and information.
-   **Support Options**: Encourages users to support the app by leaving reviews or feedback.

---

## 3. **Edit Profile**

### **File Path**: `app/(tabs)/profile/editProfile.js`

### **Purpose**:

The `EditProfile` screen allows users to update their profile information, including changing their password.

### **Key Features**:

-   **Profile Editing**: Enables users to modify their profile details.
-   **Password Management**: Allows users to change their account password.

---

## 4. **Bet History**

### **File Path**: `app/(tabs)/profile/betHistory.js`

### **Purpose**:

The `BetHistory` screen displays a list of the user's past bets, categorized by type.

### **Key Features**:

-   **Bet Slip List**: Shows a detailed list of the user's bet slips.
-   **Filter by Type**: Allows users to filter bet slips by type (e.g., active, settled).

---

## 5. **Transaction History**

### **File Path**: `app/(tabs)/profile/transactionHistory.js`

### **Purpose**:

The `TransactionHistory` screen provides a detailed view of the user's financial transactions related to betting.

### **Key Features**:

-   **Transaction List**: Displays a list of all transactions, including deposits, withdrawals, and bets.
-   **Header Information**: Provides a summary of the user's transaction history.

---

## 6. **Bet Preferences**

### **File Path**: `app/(tabs)/profile/betPreferences.js`

### **Purpose**:

The `BetPreferences` screen allows users to customize their betting preferences, such as preferred leagues and bet types.

### **Key Features**:

-   **Preference Editing**: Enables users to update their betting preferences.
-   **Integration with User Context**: Saves preferences to the user's profile.

---

## 7. **Profile Layout**

### **File Path**: `app/(tabs)/profile/_layout.js`

### **Purpose**:

The `ProfileLayout` file defines the navigation structure for the Profile tab, linking all the screens together.

### **Key Features**:

-   **Screen Navigation**: Configures navigation between screens like `profilePage`, `settings`, `editProfile`, and others.
-   **Custom Animations**: Adds custom animations for screen transitions.

---

## General Notes

-   **Navigation**: Each screen is linked through the `ProfileLayout` file, ensuring smooth transitions between screens.
-   **Context Integration**: Screens like `settings` and `betPreferences` rely on context providers (e.g., `UserContext`) for state management.
-   **Modularity**: Each screen is designed to handle a specific aspect of the user's profile, ensuring a clean and organized user experience.

For further details, refer to the respective screen files.
