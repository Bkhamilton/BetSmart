import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function AnalyticsDisplay({ data }) {

    const { grayBackground, grayBorder, iconColor } = useTheme();

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.outerContainer}>
                    <Text style={styles.dataTitleText}>Profit</Text>
                </View>
                <View style={[styles.dataContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
            </View>
            <View>
                <View style={styles.outerContainer}>
                    <Text style={styles.dataTitleText}>Bets</Text>
                </View>
                <View style={[styles.dataContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
            </View>
            <View>
                <View style={styles.outerContainer}>
                    <Text style={styles.dataTitleText}>Success</Text>
                </View>
                <View style={[styles.dataContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
            </View>
            <View>
                <View style={styles.outerContainer}>
                    <Text style={styles.dataTitleText}>ROI</Text>
                </View>
                <View style={[styles.dataContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
            </View>        
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