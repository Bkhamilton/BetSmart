import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function BetSlipDisplay({ betSlips, selectedType }) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 16 }}>{selectedType} Bets</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
});