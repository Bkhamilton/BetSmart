// src/components/LocationModal.jsx
import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Text, View, Modal, TouchableOpacity } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';

export const LocationModal = () => {
  const { locationStatus, checkLocation } = React.useContext(UserContext);
  
  // Only show modal if location is verified and not legal
  const visible = locationStatus.verified && locationStatus.isLegal === false;

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleLearnMore = () => {
    Linking.openURL('https://www.americanwagering.com/legal-sports-betting-states/');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <MaterialIcons 
            name="location-off" 
            size={48} 
            color="#FF3B30" 
            style={styles.icon} 
          />
          
          <Text style={styles.title}>Location Restriction</Text>
          
          <Text style={styles.message}>
            Sports betting tracking is currently restricted in {locationStatus.state}.
          </Text>
          
          <Text style={styles.subMessage}>
            This app is for tracking purposes only and cannot be used in states where sports betting is prohibited.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={checkLocation}
            >
              <Text style={styles.buttonText}>Recheck Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleLearnMore}
            >
              <Text style={styles.buttonText}>Learn About Legal States</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton]}
              onPress={handleOpenSettings}
            >
              <Text style={styles.buttonText}>App Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  subMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButtonText: {
    color: '#8E8E93',
  },
});