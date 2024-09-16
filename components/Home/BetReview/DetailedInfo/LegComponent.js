import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function LegComponent({ leg }) {

    const displayLegInfo = (leg) => {
        const isWholeNumber = 'line' in leg && (Number.isInteger(parseFloat(leg.value)) || parseFloat(leg.value) % 1 === 0);

        if ('overUnder' in leg && 'line' in leg) {
            if (isWholeNumber) {
                return `${leg.value}+ ${leg.marketType}`;
            } else {
                return `${leg.overUnder} ${leg.value} ${leg.marketType}`;
            }
        } else if ('line' in leg) {
            if (isWholeNumber) {
                return `${leg.value}+ ${leg.marketType}`;
            } else {
                return `${leg.value} ${leg.marketType}`;
            }
        } else {
            return `${leg.betTarget} ${leg.marketType}`;
        }
    };

    return (
        <View style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1 }} />
                <View style={{ backgroundColor: 'transparent', paddingLeft: 4 }}>
                    <Text style={{ fontWeight: '600' }}>{leg.betTarget}</Text>
                    <Text>{displayLegInfo(leg)}</Text>
                </View>
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