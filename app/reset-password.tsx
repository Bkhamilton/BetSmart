import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import useAuthState from '@/hooks/useAuthState';
import useTheme from '@/hooks/useTheme';
import { processSupabaseAuthLink } from '@/services/authLinks';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { verified } = useLocalSearchParams<{ verified?: string }>();
    const { buttonGreen, grayBackground, grayBorder } = useTheme();
    const { updatePassword, authError, isLoading } = useAuthState();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [linkReady, setLinkReady] = useState(false);
    const [linkError, setLinkError] = useState<string | null>(null);
    const processedUrls = useRef(new Set<string>());

    useEffect(() => {
        if (verified === '1') {
            setLinkReady(true);
            return;
        }

        let mounted = true;
        const handleUrl = async (url: string) => {
            if (processedUrls.current.has(url)) return;
            processedUrls.current.add(url);
            try {
                const type = await processSupabaseAuthLink(url);
                if (type !== 'recovery') throw new Error('This is not a password recovery link.');
                if (mounted) {
                    setLinkReady(true);
                    setLinkError(null);
                }
            } catch (caught) {
                console.error('Unable to verify password recovery link:', caught instanceof Error ? caught.message : 'Unknown error.');
                if (mounted) setLinkError(caught instanceof Error ? caught.message : 'The recovery link could not be verified.');
            }
        };

        Linking.getInitialURL().then((url) => {
            if (url) return handleUrl(url);
            setLinkError('Open the password reset link from your email to continue.');
        }).catch((caught: unknown) => {
            console.error('Unable to read password recovery link:', caught instanceof Error ? caught.message : 'Unknown error.');
            if (mounted) setLinkError(caught instanceof Error ? caught.message : 'The recovery link could not be read.');
        });

        const subscription = Linking.addEventListener('url', ({ url }) => {
            void handleUrl(url);
        });
        return () => {
            mounted = false;
            subscription.remove();
        };
    }, [verified]);

    const handleSave = async () => {
        if (password.length < 8) {
            Alert.alert('Password too short', 'Use a password with at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match', 'Enter the same password in both fields.');
            return;
        }

        const updated = await updatePassword(password);
        if (updated) {
            Alert.alert('Password updated', 'You can now sign in with your new password.');
            router.replace('/(tabs)/(index)');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.description}>Use the secure link sent to your email to choose a new password.</Text>
            {linkReady ? (
                <>
                    <TextInput
                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                        placeholder="New password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete="new-password"
                    />
                    <TextInput
                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoComplete="new-password"
                    />
                    {authError ? <Text style={styles.error}>{authError}</Text> : null}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: buttonGreen }]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Updating...' : 'Update Password'}</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    {linkError ? <Text style={styles.error}>{linkError}</Text> : <ActivityIndicator size="large" />}
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/(index)/login')}>
                        <Text>Return to sign in</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        marginBottom: 24,
        opacity: 0.75,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 16,
        padding: 16,
        marginBottom: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: '#c62828',
        marginBottom: 12,
    },
});
