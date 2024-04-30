import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Pressable } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function DataHeader() {
  return (
    <View style={styles.container}>
        <View>
            <View>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>My Bet Data</Text>
            </View>
            <View>
                <Text style={{ fontSize: 12, fontWeight: '500', opacity: 0.7 }}>View Detailed Bet Analytics Here</Text>
            </View>
        </View>
        <View>
            <Pressable style={styles.filterButton}>
                <Ionicons name="filter" size={24} color="white" />
                <Text style={{ color: 'white' }}>Filter</Text>
            </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterButton: {
        backgroundColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
});