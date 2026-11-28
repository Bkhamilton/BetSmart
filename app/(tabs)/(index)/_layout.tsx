import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack>
            {/* Match Expo Router's seeded route order to avoid reconciliation during redirects. */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="history" options={{ headerShown: false }} />
        </Stack>
    );
}