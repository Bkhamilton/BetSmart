import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../Themed';
import useTheme from '@/hooks/useTheme';

export default function Header({ title, children }) {

  const { grayBorder } = useTheme();

  return (
    <View style={[styles.HeaderContainer, { borderColor: grayBorder }]}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
