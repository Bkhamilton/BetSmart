import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function IntroInfo({ currentGame }) {

    const getDate = (dateString) => {
        const date = new Date(dateString);
        const estDate = new Date(date.getTime());
        const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
        const day = estDate.getDate();
        return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`; // Returns the date in MM/DD format
    };
      
    const getTime = (dateString) => {
        const date = new Date(dateString);
        const estDate = new Date(date.getTime()); // Subtract 4 hours from UTC to get EST
        let hours = estDate.getHours();
        const minutes = estDate.getMinutes();
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr}`; // Returns the time part in 12-hour format
    };
      
    const getAmPm = (dateString) => {
        const date = new Date(dateString);
        const estDate = new Date(date.getTime() - (3600000 * 4)); // Subtract 4 hours from UTC to get EST
        const hours = estDate.getHours();
        return hours >= 12 ? 'PM' : 'AM';
    };

    return (
        <View style={{ borderWidth: 1 }}>
          <View style={styles.dateTimeContainer}>
            <Text>{getDate(currentGame.start_timestamp)}</Text>
            <Text>{getTime(currentGame.start_timestamp)} {getAmPm(currentGame.start_timestamp)}</Text>
          </View>
          <View style={styles.matchupContainer}>
            <Text style={styles.matchupTitle}>{currentGame.away_team}</Text>
            <Text>vs</Text>
            <Text style={styles.matchupTitle}>{currentGame.home_team}</Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    matchupContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
        matchupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
        dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    }
});