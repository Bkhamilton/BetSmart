import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getDate, getTime, getAmPm } from '@/utils/dateFunctions';

export default function DateTime({ timestamp }) {
    return (
        <View style={styles.dateTimeContainer}>
            <View style={styles.timeBlock}>
                <Text style={{ fontSize: 18 }}>{getTime(timestamp)}</Text>
                <Text style={{ fontSize: 12 }}>{getAmPm(timestamp)}</Text>
            </View>
            <View style={styles.dateBlock}>
                <Text style={{ fontSize: 14 }}>{getDate(timestamp)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dateTimeContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10, 
        paddingBottom: 2,
        backgroundColor: 'transparent'
    },
    timeBlock: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        backgroundColor: 'transparent'
    },
    dateBlock: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'transparent'
    },
});