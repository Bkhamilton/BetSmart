import React, { useState, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import { bookieImages } from '@/constants/bookieConstants';
import { Bookie } from '@/constants/types';
import { useSQLiteContext } from 'expo-sqlite';
import { insertBalance } from '@/db/user-specific/Balance';

interface OnboardingBookiesScreenProps {
  onComplete: () => void;
}

export default function OnboardingBookiesScreen({ onComplete }: OnboardingBookiesScreenProps) {
  const { bookies } = useContext(DBContext);
  const { user } = useContext(UserContext);
  const { grayBackground, grayBorder, buttonGreen } = useTheme();
  const db = useSQLiteContext();
  
  const [selectedBookies, setSelectedBookies] = useState<number[]>([]);

  const toggleBookieSelection = (bookieId: number) => {
    setSelectedBookies(prev => 
      prev.includes(bookieId) 
        ? prev.filter(id => id !== bookieId)
        : [...prev, bookieId]
    );
  };

  const handleFinishOnboarding = async (retryCount = 0) => {
    const MAX_RETRIES = 5;
    
    // Ensure user is available before adding bookies
    if (!user) {
      if (retryCount < MAX_RETRIES) {
        console.warn(`User not available yet, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        // Try again after a short delay
        setTimeout(() => handleFinishOnboarding(retryCount + 1), 500);
      } else {
        console.error('User not available after maximum retries');
        alert('An error occurred. Please try again.');
      }
      return;
    }
    
    // Add all selected bookies to user's active bookies
    if (selectedBookies.length > 0) {
      for (const bookieId of selectedBookies) {
        await insertBalance(db, bookieId, 0, user.id);
      }
    }
    // Navigate to home
    onComplete();
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.headerText}>Choose Your Sportsbooks</Text> 
        </View>
      </View>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.subtitle}>Select the sportsbooks you plan to use</Text>
          
          <View style={styles.bookiesGrid}>
            {bookies.map((bookie: Bookie) => (
              <TouchableOpacity
                key={bookie.id}
                style={[
                  styles.bookieCard,
                  { 
                    backgroundColor: grayBackground, 
                    borderColor: selectedBookies.includes(bookie.id) ? buttonGreen : grayBorder,
                    borderWidth: selectedBookies.includes(bookie.id) ? 3 : 1,
                  }
                ]}
                onPress={() => toggleBookieSelection(bookie.id)}
              >
                <Image source={bookieImages[bookie.name]} style={styles.bookieImage} />
                <Text style={styles.bookieName}>{bookie.name}</Text>
                {selectedBookies.includes(bookie.id) && (
                  <View style={[styles.checkmark, { backgroundColor: buttonGreen }]}>
                    <FontAwesome5 name="check" size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.finishButton, 
              { 
                backgroundColor: selectedBookies.length > 0 ? buttonGreen : grayBorder,
                opacity: selectedBookies.length > 0 ? 1 : 0.5,
              }
            ]}
            onPress={handleFinishOnboarding}
            disabled={selectedBookies.length === 0}
            accessibilityLabel={selectedBookies.length > 0 
              ? `Add ${selectedBookies.length} sportsbook${selectedBookies.length > 1 ? 's' : ''} and continue` 
              : 'Select at least one sportsbook to continue'}
            accessibilityHint={selectedBookies.length === 0 ? 'This button is disabled. Please select at least one sportsbook.' : undefined}
          >
            <Text style={styles.finishButtonText}>
              {selectedBookies.length > 0 
                ? `Add ${selectedBookies.length} Sportsbook${selectedBookies.length > 1 ? 's' : ''} & Continue` 
                : 'Select at least one sportsbook'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 30,
  },
  bookiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  bookieCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bookieImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  bookieName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
