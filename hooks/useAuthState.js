import { useState, useCallback, useContext } from 'react';
import { getUser, insertUser } from '@/db/user-specific/Users';
import { insertUserSession, getMostRecentUserSession, insertNonActiveUserSession } from '@/db/user-specific/UserSessions';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';

const useAuthState = (closeLoginModal) => {

    const { db } = useContext(DBContext);

    const { signedIn, setSignedIn } = useContext(UserContext);

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
    
    const signUp = useCallback(async (username, email, name, password) => {
        try {
            // Check if the username is already taken
            const user = await getUser(db, username);

            if (user) {
                setAuthError('Username is already taken');
                return false;
            }

            // If the username is not taken, create a new user
            const today = new Date().toISOString();
            const userId = await insertUser(db, name, email, username, password);
            await insertUserSession(db, userId, today);
            setSignedIn(true);

            closeSignUpModal();
            setAuthError(null);
            return true;
        } catch (error) {
            setAuthError('An error occurred during sign up');
            return false;
        }
    }, [db, closeSignUpModal]);

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
            setSignedIn(true);

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
                setSignedIn(false);
    
                console.log('User signed out successfully');
            } else {
                console.log('No active session found for the user');
            }
        } catch (error) {
            console.error('Error signing out user:', error);
        }
    };    

    // function to close login modal and open up sign up modal
    const handleSignUp = () => {
        closeLoginModal();
        openSignUpModal();
    };

    return {
        loginModalVisible,
        setLoginModalVisible,
        signUpModalVisible,
        setSignUpModalVisible,
        login,
        signUp,
        authError,
        openLoginModal,
        closeLoginModal,
        openSignUpModal,
        closeSignUpModal,
        signOutUser,
        handleSignUp,
    };
};

export default useAuthState;