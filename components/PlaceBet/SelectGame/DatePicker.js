import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function DatePicker({ date, updateDate }) {

    const { iconColor } = useTheme();

    const today = new Date();
    const todaysDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity 
                    onPress={() => updateDate('prev')}
                    style={styles.dateButton}
                >
                    <FontAwesome5 name="chevron-left" size={16} color={iconColor} />
                </TouchableOpacity> 
            </View>
            <View>
                <Text style={styles.dateText}>{todaysDate === date ? 'Today, ' : ''}{date}</Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => updateDate('next')}
                    style={styles.dateButton}
                >
                    <FontAwesome5 name="chevron-right" size={16} color={iconColor} />
                </TouchableOpacity> 
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8, 
    paddingTop: 2,
  },
  dateText: {
    fontSize: 12, 
    fontWeight: '500'
  },
  dateButton: {
    padding: 4,
  },
});