import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function ChooseRecommendedType({ selectType, type }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <View style={styles.container}>
          <TouchableOpacity 
            style={[styles.typeContainer, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}
            onPress={() => selectType('Wins')}
          >
              <Text style={[styles.typeText, type === 'Wins' && styles.activeType]}>Wins</Text>
          </TouchableOpacity>
          <View style={[styles.typeContainer, { borderLeftWidth: 1, borderRightWidth: 1 }]}>
            <TouchableOpacity
              style={{ width: '100%', alignItems: 'center' }}
              onPress={() => selectType('Losses')}
            >
                <Text style={[styles.typeText, type === 'Losses' && styles.activeType]}>Losses</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.typeContainer, { borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}
            onPress={() => selectType('Recent')}
          >
              <Text style={[styles.typeText, type === 'Recent' && styles.activeType]}>Recent</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '100%',
    flexDirection: 'row',
  },
  typeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4
  },
  typeText: {
    fontSize: 16,
  },
  activeType: {
    fontWeight: 'bold',
  },
});
