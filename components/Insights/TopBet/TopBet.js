import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Pressable } from '@/components/Themed';
import CompactBetSlip from './CompactBetSlip';
import useTheme from '@/hooks/useTheme';

export default function TopBet({ betSlip }) {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Top Bet</Text>
            </View>
            <View style={[styles.betSlipContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <CompactBetSlip betSlip={betSlip} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    betSlipContainer: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
    },
});