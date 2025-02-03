import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function AnalyticsDisplay({ data }) {

    const { grayBackground, grayBorder, iconColor } = useTheme();

    const DataComponent = ({ title, value, label }) => {

        const displayValueText = () => {
            switch (label) {
                case '$':
                    return `$${value.toFixed(2)}`;
                case 'Bets':
                    return `${value} Bets`;
                case '%':
                    return `${value.toFixed(2)}%`;
                default:
                    return value;
            }
        }

        return (
            <View>
                <View style={styles.outerContainer}>
                    <Text style={styles.dataTitleText}>{title}</Text>
                </View>
                <View style={[styles.dataContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                    <Text style={{ fontSize: 28, fontWeight: '600' }}>{displayValueText()}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <DataComponent
                title="Profit"
                value={0}
                label="$"
            />
            <DataComponent
                title="Bets"
                value={0}
                label="Bets"
            />
            <DataComponent
                title="Win Rate"
                value={0}
                label="%"
            />
            <DataComponent
                title="ROI"
                value={0}
                label="%"
            />      
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 16,
    },
    dataContainer: {
        borderWidth: 1,
        borderRadius: 8,
        width: '100%',
        height: 100,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    dataTitleText: {
        fontSize: 20,
        fontWeight: '600',
    },
    outerContainer: {
        paddingVertical: 8,
        paddingLeft: 2,
    }
});