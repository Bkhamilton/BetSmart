import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, ClearView } from '@/components/Themed';
import { getDate, getTime, getAmPm } from '@/utils/dateFunctions';

export default function DateTime({ timestamp }) {
    return (
        <ClearView style={styles.dateTimeContainer}>
            <ClearView style={styles.timeBlock}>
                <Text style={{ fontSize: 18 }}>{getTime(timestamp)}</Text>
                <Text style={{ fontSize: 12 }}>{getAmPm(timestamp)}</Text>
            </ClearView>
            <ClearView style={styles.dateBlock}>
                <Text style={{ fontSize: 14 }}>{getDate(timestamp)}</Text>
            </ClearView>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    dateTimeContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10, 
        paddingBottom: 2,
    },
    timeBlock: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
    },
    dateBlock: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});