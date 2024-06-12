import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function DatePicker({ date, updateDate }) {

    const { iconColor } = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 2 }}>
            <View>
                <TouchableOpacity 
                    onPress={() => updateDate('prev')}
                    style={{ padding: 4 }}
                >
                    <FontAwesome5 name="chevron-left" size={16} color={iconColor} />
                </TouchableOpacity> 
            </View>
            <View>
                <Text style={{ fontSize: 12, fontWeight: '500' }}>Today, {date}</Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => updateDate('next')}
                    style={{ padding: 4 }}
                >
                    <FontAwesome5 name="chevron-right" size={16} color={iconColor} />
                </TouchableOpacity> 
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
});