import { useCallback, useContext, useState } from 'react';
import * as Linking from 'expo-linking';
import { supabase } from '@/services/supabase';
import { UserContext } from '@/contexts/UserContext';

const authRedirectUrl = (path) => Linking.createURL(path);

const readableAuthError = (error, operation) => {
    if (error?.code === '23505' || error?.code === 'username_unavailable') return 'That username is unavailable.';
    if (/network|fetch failed|offline/i.test(error?.message ?? '')) {
        return 'A network connection is required. Check your connection and try again.';
    }
    if (error?.status === 429) return 'Too many attempts. Please wait and try again.';
    if (error?.code === 'email_not_confirmed') {
        return 'If email confirmation is required, use the link sent to your inbox or request a new one.';
    }
    if (operation === 'sign in') return 'Email or password is incorrect.';
    if (operation === 'send password reset email' || operation === 'resend confirmation email') {
        return 'If an account can use this address, an email will be sent shortly.';
    }
    if (operation === 'sign up') return 'Unable to create the account. Check your details or try signing in.';
    return `Unable to ${operation}. Please try again.`;
};

const useAuthState = () => {
    const {
        activateAccount,
        authError,
        setAuthError,
        signedIn,
    } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);

    const performAuthAction = useCallback(async (operation, action) => {
        if (!supabase) {
            setAuthError('Supabase authentication is not configured.');
            return false;
        }

        setIsLoading(true);
        setAuthError(null);
        try {
            return await action();
        } catch (error) {
            setAuthError(readableAuthError(error, operation));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [setAuthError]);

    const signUp = useCallback((username, email, name, password) =>
        performAuthAction('sign up', async () => {
            const { data: currentSession, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
            if (currentSession.session) {
                if (currentSession.session.user.email?.toLowerCase() !== email.trim().toLowerCase()) {
                    throw new Error('Sign out before creating a different account.');
                }
                const { data, error } = await supabase.auth.updateUser({
                    data: {
                        username: username.trim().toLowerCase(),
                        display_name: name.trim(),
                    },
                });
                if (error) throw error;
                if (!data.user) throw new Error('Supabase did not return the authenticated user.');
                await activateAccount(data.user);
                setSignUpModalVisible(false);
                return true;
            }

            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
                options: {
                    data: {
                        username: username.trim().toLowerCase(),
                        display_name: name.trim(),
                    },
                    emailRedirectTo: authRedirectUrl('auth/callback'),
                },
            });
            if (error) throw error;

            if (!data.session || !data.user) {
                setAuthError('If the address can be registered, check your email to confirm before signing in.');
                return false;
            }

            await activateAccount(data.user);
            setSignUpModalVisible(false);
            return true;
        }), [activateAccount, performAuthAction, setAuthError]);

    const login = useCallback((email, password) =>
        performAuthAction('sign in', async () => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });
            if (error) throw error;
            if (!data.session || !data.user) throw new Error('Supabase did not establish an authenticated session.');

            await activateAccount(data.user);
            setLoginModalVisible(false);
            return true;
        }), [activateAccount, performAuthAction]);

    const signOutUser = useCallback(() =>
        performAuthAction('sign out', async () => {
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if (error) throw error;
            return true;
        }), [performAuthAction]);

    const requestPasswordReset = useCallback((email) =>
        performAuthAction('send password reset email', async () => {
            const { error } = await supabase.auth.resetPasswordForEmail(
                email.trim().toLowerCase(),
                { redirectTo: authRedirectUrl('reset-password') }
            );
            if (error) throw error;
            return true;
        }), [performAuthAction]);

    const resendConfirmation = useCallback((email) =>
        performAuthAction('resend confirmation email', async () => {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email.trim().toLowerCase(),
                options: { emailRedirectTo: authRedirectUrl('auth/callback') },
            });
            if (error) throw error;
            return true;
        }), [performAuthAction]);

    const updatePassword = useCallback((password) =>
        performAuthAction('update password', async () => {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            return true;
        }), [performAuthAction]);

    const updateProfile = useCallback(({ name, username, email }) =>
        performAuthAction('update profile', async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('An authenticated account is required.');

            const { error: profileError } = await supabase
                .from('bs_profiles')
                .update({ display_name: name.trim(), username: username.trim().toLowerCase() })
                .eq('user_id', user.id);
            if (profileError) throw profileError;

            await activateAccount(user);
            if (email.trim().toLowerCase() !== (user.email ?? '').toLowerCase()) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: email.trim().toLowerCase(),
                });
                if (emailError) throw emailError;
                setAuthError('Profile saved. Confirm the email change using the link we sent you.');
            }

            return true;
        }), [activateAccount, performAuthAction, setAuthError]);

    const openLoginModal = () => setLoginModalVisible(true);
    const closeLoginModal = () => setLoginModalVisible(false);
    const openSignUpModal = () => setSignUpModalVisible(true);
    const closeSignUpModal = () => setSignUpModalVisible(false);
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
        signOutUser,
        requestPasswordReset,
        resendConfirmation,
        updatePassword,
        updateProfile,
        authError,
        isLoading,
        signedIn,
        openLoginModal,
        closeLoginModal,
        openSignUpModal,
        closeSignUpModal,
        handleSignUp,
    };
};

export default useAuthState;
