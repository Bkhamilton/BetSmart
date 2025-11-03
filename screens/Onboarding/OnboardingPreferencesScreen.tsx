import React, { useState, useContext } from 'react';
import { View, Text } from '@/components/Themed';
import EditPreferences from '@/components/Profile/BetPreferences/EditPreferences';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { Preference } from '@/constants/types';
import { StyleSheet } from 'react-native';

interface OnboardingPreferencesScreenProps {
  onPreferencesSaved: () => void;
}

export default function OnboardingPreferencesScreen({ onPreferencesSaved }: OnboardingPreferencesScreenProps) {
  const { leagues } = useContext(DBContext);
  const { updatePreferences } = useContext(UserContext);
  
  const [preferences, setPreferences] = useState<Preference>({
    bankroll: 0,
    dailyLimit: 0,
    unitSize: '',
    preferredLeagues: [],
    preferredBetTypes: [],
    riskTolerance: 0,
    oddsFormat: '',
  });

  const handleSavePreferences = async (prefs: Preference) => {
    await updatePreferences(prefs);
    // Move to bookies selection step
    onPreferencesSaved();
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.headerText}>Set Your Preferences</Text> 
        </View>
      </View>
      <EditPreferences 
        userPreferences={preferences}
        setUserPreferences={setPreferences}
        leagues={leagues}
        onSave={handleSavePreferences}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20, 
    paddingTop: 48,
    paddingBottom: 12,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
