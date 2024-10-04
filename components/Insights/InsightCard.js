import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function InsightCard({ title }) {

  const { grayBackground, grayBorder } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
      <ClearView>
        <Text style={{ fontSize: 16 }}>{title}</Text>
        <Text style={{ fontSize: 14, fontWeight: '500' }}>This is where a description of the title will go.</Text>
      </ClearView>
      <ClearView>
        {/* Example Bets Here */}
      </ClearView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 120,
    borderRadius: 8,
  },
});