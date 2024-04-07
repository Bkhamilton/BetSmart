import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function ChooseRecommendedType({ selectType }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
      <View style={styles.container}>
          <TouchableOpacity 
            style={[styles.typeContainer, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}
            onPress={() => selectType('Wins')}
          >
              <Text style={styles.typeText}>Wins</Text>
          </TouchableOpacity>
          <View style={[styles.typeContainer, { borderLeftWidth: 1, borderRightWidth: 1 }]}>
            <TouchableOpacity
              onPress={() => selectType('Losses')}
            >
                <Text style={styles.typeText}>Losses</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.typeContainer, { borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}
            onPress={() => selectType('Recent')}
          >
              <Text style={styles.typeText}>Recent</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
  },
  typeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
