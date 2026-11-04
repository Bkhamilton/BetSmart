import { Stack } from 'expo-router';
import { BetContextProvider } from '@/contexts/NewBetContext/BetContext/BetContext';

export default function NewBetLayout() {
    return (
        <BetContextProvider>
            <Stack>
                <Stack.Screen
                    name="selectGame"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="betDetails"
                    options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                        headerShown: false,
                    }}
                />
            </Stack>
        </BetContextProvider>
    );
}