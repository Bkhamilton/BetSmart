import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

export default function MainLine() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', paddingHorizontal: 8, }}>
                <FontAwesome5 name="chevron-down" size={16} color={iconColor} />
            </View>
            <View>
                <Text style={{ fontSize: 16 }}>Main Line</Text>
            </View>
            <View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
});