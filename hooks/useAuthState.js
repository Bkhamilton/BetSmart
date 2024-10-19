import { useState, useCallback } from 'react';
import { getUser } from '@/db/user-specific/Users';
import { insertUserSession, getMostRecentUserSession, insertNonActiveUserSession } from '@/db/user-specific/UserSessions';
import { useSQLiteContext } from 'expo-sqlite';

const useAuthState = (closeLoginModal) => {

    const db = useSQLiteContext();

    const [authError, setAuthError] = useState(null);

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);

    function openLoginModal() {
        setLoginModalVisible(true);
    }

    function closeLoginModal() {
        setLoginModalVisible(false);
    }

    function openSignUpModal() {
        setSignUpModalVisible(true);
    }

    function closeSignUpModal() {
        setSignUpModalVisible(false);
    }
    

    const login = useCallback(async (username, password) => {
        try {
        // Check if the username and password match
        const user = await getUser(db, username, password);

        if (!user) {
            setAuthError('Invalid username or password');
            return false;
        }

        // If the username and password match, create a new session
        const today = new Date().toISOString();
        await insertUserSession(db, user.id, today);

        closeLoginModal();
        setAuthError(null);
        return true;
        } catch (error) {
        setAuthError('An error occurred during login');
        return false;
        }
    }, [db, closeLoginModal]);

    const signOutUser = async (userId) => {
        try {
            // Get the most recent user session
            const userSession = await getMostRecentUserSession(db, userId);
    
            if (userSession) {
                const loginTimestamp = userSession.loginTimestamp;
                const logoutTimestamp = new Date().toISOString();
    
                // Insert a non-active user session
                await insertNonActiveUserSession(db, userId, loginTimestamp, logoutTimestamp);
    
                console.log('User signed out successfully');
            } else {
                console.log('No active session found for the user');
            }
        } catch (error) {
            console.error('Error signing out user:', error);
        }
    };    

    return {
        loginModalVisible,
        setLoginModalVisible,
        signUpModalVisible,
        setSignUpModalVisible,
        login,
        authError,
        openLoginModal,
        closeLoginModal,
        openSignUpModal,
        closeSignUpModal,
        signOutUser,
    };
};

export default useAuthState;