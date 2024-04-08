import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from '../ExternalLink';
import { MonoText } from '../StyledText';
import { Text, View } from '../Themed';

export default function Header({ title, children }) {
  return (
    <View style={styles.HeaderContainer}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <View>
          {children}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
