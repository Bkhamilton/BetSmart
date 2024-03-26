import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from '../ExternalLink';
import { MonoText } from '../StyledText';
import { Text, View } from '../Themed';

export default function Header({ title, children }) {
  return (
    <View style={styles.HeaderContainer}>
        <Text style={{ marginTop: 44, fontSize: 22, fontWeight: 'bold' }}>{title}</Text>
        {children}
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    alignItems: 'center',
    height: 84, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1
  },
});
