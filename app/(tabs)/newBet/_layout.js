import { Stack } from 'expo-router';
import { BetContextProvider } from '@/contexts/BetContext/BetContext';
import { ModalContextProvider } from '@/contexts/BetContext/ModalContext';

export default function NewBetLayout() {
  return (
    <BetContextProvider>
      <ModalContextProvider>
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
      </ModalContextProvider>
    </BetContextProvider>
  );
}