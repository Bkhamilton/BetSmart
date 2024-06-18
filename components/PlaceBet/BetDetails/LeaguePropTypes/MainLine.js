import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

export default function MainLine() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const DisplayLine = ({ line }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ borderWidth: 1, borderRadius: 20, width: 40, height: 40 }}/>
                <Text>{line.name}</Text>
                <Text>{line.value}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainLine}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    mainLine: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
    }
});