import { Stack } from 'expo-router';
import BetDetailsScreen from './betDetails';
import NewBetScreen from './selectGame';

export default function NewBetLayout() {
  return (
    <Stack>
      <Stack.Screen name="selectGame" options={{ headerShown: false }} />
      <Stack.Screen name="betDetails" options={{ presentation: 'modal' }} />
    </Stack>
  );
}