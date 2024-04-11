import { Stack } from 'expo-router';

export default function NewBetLayout() {
  return (
    <Stack>
      <Stack.Screen name="selectGame" options={{ headerShown: false }} />
      <Stack.Screen name="betDetails" options={{ presentation: 'card', animation: 'slide_from_right', headerShown: false }} />
    </Stack>
  );
}