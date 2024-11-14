import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function StatCounter({ title, won, total }) {

    // Function to determine font size
    const determineFontSize = (won, total) => {
        if (won.toString().length > 1 && total.toString().length > 1) {
        return 11;
        } else {
        return 12;
        }
    };

    const fontSize = determineFontSize(won, total);

    return (
        <View style={styles.statCounterContainer}>
            <View style={styles.statCounterTitle}>
                <Text style={styles.statCounterTitleText}>{title}:</Text>
            </View>
            <View style={styles.statCounterTotal}>
                <Text style={[styles.statCounterTotalText, { fontSize: fontSize }]}>{`${won}/${total}`}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statCounterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1, 
        backgroundColor: 'transparent',
    },
    statCounterTitle: {
        flex: 0.61,
        alignItems: 'flex-end',
        backgroundColor: 'transparent',  
    },
    statCounterTotal: {
        flex: 0.39,
        alignItems: 'flex-start',
        backgroundColor: 'transparent',  
    },  
    statCounterTitleText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statCounterTotalText: {
        fontWeight: '700',
    },
});