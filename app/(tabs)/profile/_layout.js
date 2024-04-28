import { Stack } from 'expo-router';

export default function NewBetLayout() {
  return (
    <Stack>
      <Stack.Screen name="profilePage" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: 'card', animation: 'slide_from_right', headerShown: false }} />
      <Stack.Screen name="betHistory" options={{ presentation: 'card', animation: 'slide_from_left', headerShown: false }} />
    </Stack>
  );
}