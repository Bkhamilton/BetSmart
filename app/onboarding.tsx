import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react';

import { Text, View } from '@/components/Themed';
import EditPreferences from '@/components/Profile/BetPreferences/EditPreferences';
import { DBContext } from '@/contexts/DBContext';

export default function OnboardingScreen() {
  const { leagues } = useContext(DBContext);
  
  const [preferences, setPreferences] = useState({
    bankroll: 0,
    dailyLimit: 0,
    unitSize: '',
    preferredLeagues: [],
    preferredBetTypes: [],
    riskTolerance: 0,
    oddsFormat: '',
  });

  const handleSavePreferences = (updatedPreferences) => {
    console.log('Saving onboarding preferences:', updatedPreferences);
    // Custom save logic for onboarding
    // Could navigate to next step, save to local storage, etc.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Betting Preferences</Text>
      <EditPreferences
        userPreferences={preferences}
        setUserPreferences={setPreferences}
        leagues={leagues}
        onSave={handleSavePreferences}
      />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
