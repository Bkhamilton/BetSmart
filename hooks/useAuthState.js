import { useState, useCallback } from 'react';
import { getUser } from '@/db/user-specific/Users';
import { insertUserSession } from '@/db/user-specific/UserSessions';

const useAuthState = (db, closeLoginModal) => {

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
    };
};

export default useAuthState;