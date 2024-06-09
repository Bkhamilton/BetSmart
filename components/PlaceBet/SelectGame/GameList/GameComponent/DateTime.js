import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function DateTime({ timestamp }) {

    const getDate = (dateString) => {
        const date = new Date(dateString);
        const estDate = new Date(date.getTime());
        const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
        const day = estDate.getDate();
        return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`; // Returns the date in MM/DD format
    };
    
    const getTime = (dateString) => {
      const date = new Date(dateString);
      const estDate = new Date(date.getTime());
      let hours = estDate.getHours();
      const minutes = estDate.getMinutes();
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutesStr}`; // Returns the time part in 12-hour format
    };
    
    const getAmPm = (dateString) => {
      const date = new Date(dateString);
      const estDate = new Date(date.getTime());
      const hours = estDate.getHours();
      return hours >= 12 ? 'PM' : 'AM';
    };

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