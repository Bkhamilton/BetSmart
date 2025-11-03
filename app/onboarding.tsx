import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from '@/components/Themed';

import OnboardingSignUpScreen from '@/screens/Onboarding/OnboardingSignUpScreen';
import OnboardingPreferencesScreen from '@/screens/Onboarding/OnboardingPreferencesScreen';
import OnboardingBookiesScreen from '@/screens/Onboarding/OnboardingBookiesScreen';

type OnboardingStep = 'signup' | 'preferences' | 'bookies';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('signup');

  const handleSignUpSuccess = () => {
    setStep('preferences');
  };

  const handlePreferencesSaved = () => {
    setStep('bookies');
  };

  const handleComplete = () => {
    router.replace('/(tabs)/(index)');
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      {step === 'signup' && (
        <OnboardingSignUpScreen 
          onSignUpSuccess={handleSignUpSuccess}
          onClose={handleClose}
        />
      )}
      {step === 'preferences' && (
        <OnboardingPreferencesScreen 
          onPreferencesSaved={handlePreferencesSaved}
        />
      )}
      {step === 'bookies' && (
        <OnboardingBookiesScreen 
          onComplete={handleComplete}
        />
      )}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
