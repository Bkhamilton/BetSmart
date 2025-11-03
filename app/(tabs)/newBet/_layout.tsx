import { Stack } from 'expo-router';
import { GameContextProvider } from '@/contexts/NewBetContext/GameContext';
import { LeagueContextProvider } from '@/contexts/NewBetContext/LeagueContext';
import { BookieSelectionContextProvider } from '@/contexts/NewBetContext/BookieSelectionContext';
import { BetSlipContextProvider } from '@/contexts/NewBetContext/BetSlipContext';

export default function NewBetLayout() {
    return (
        <GameContextProvider>
            <LeagueContextProvider>
                <BookieSelectionContextProvider>
                    <BetSlipContextProvider>
                        <Stack>
                            <Stack.Screen
                                name="selectGame"
                                options={{ headerShown: false }}
                                initialParams={{ currentGame: null }}
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
                    </BetSlipContextProvider>
                </BookieSelectionContextProvider>
            </LeagueContextProvider>
        </GameContextProvider>
    );
}