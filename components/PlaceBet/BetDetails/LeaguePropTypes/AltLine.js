import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function AltLine({ info }) {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Alternate' + JSON.stringify(info) + 'Line';

    return (
        <View style={styles.container}>
            <PropBanner title={title} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
});