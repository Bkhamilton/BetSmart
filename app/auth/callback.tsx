import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { processSupabaseAuthLink } from '@/services/authLinks';

export default function AuthCallbackScreen() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const processedUrls = useRef(new Set<string>());

    useEffect(() => {
        let mounted = true;
        const handleUrl = async (url: string) => {
            if (processedUrls.current.has(url)) return;
            processedUrls.current.add(url);
            try {
                const type = await processSupabaseAuthLink(url);
                if (!mounted) return;
                if (type === 'recovery') router.replace('/reset-password?verified=1' as Href);
                else router.replace('/(tabs)/(index)');
            } catch (caught) {
                console.error('Unable to complete the authentication link:', caught instanceof Error ? caught.message : 'Unknown error.');
                if (mounted) setError(caught instanceof Error ? caught.message : 'The authentication link could not be completed.');
            }
        };

        Linking.getInitialURL().then((url) => {
            if (url) return handleUrl(url);
            setError('No authentication link was found. Request a new email and try again.');
        }).catch((caught: unknown) => {
            console.error('Unable to read the authentication link:', caught instanceof Error ? caught.message : 'Unknown error.');
            if (mounted) setError(caught instanceof Error ? caught.message : 'The authentication link could not be read.');
        });

        const subscription = Linking.addEventListener('url', ({ url }) => {
            void handleUrl(url);
        });
        return () => {
            mounted = false;
            subscription.remove();
        };
    }, [router]);

    return (
        <View style={styles.container}>
            {error ? <Text>{error}</Text> : <ActivityIndicator accessibilityLabel="Verifying account" size="large" />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
});
