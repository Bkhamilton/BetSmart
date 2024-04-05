import React from 'react';
import { Text, Linking } from 'react-native';

export default function CreditsScreen() {
  return (
    <Text onPress={() => Linking.openURL('https://www.flaticon.com/free-icons/basketball')}>
      Basketball icons created by ranksol graphics - Flaticon
    </Text>
  );
}