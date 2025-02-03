import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Pressable } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function TimeSelector({ selectTime, curTime }) {

    const timeSlots = [
        {
            title: 'All',
            id: 1,
        },
        {
            title: '7D',
            id: 2,
        },
        {
            title: '1M',
            id: 3,
        },
        {
            title: '3M',
            id: 4,
        },
        {
            title: '6M',
            id: 5,
        },
        {
            title: '1Y',
            id: 6,
        },
    ]

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: grayBorder }}>
                {timeSlots.map((item) => (
                    <Pressable
                        key={item.id}
                        style={[styles.categoryContainer, { backgroundColor: curTime === item.title ? grayBackground : grayBorder, borderColor: curTime === item.title ? grayBorder : grayBackground }]}
                        onPress={() => selectTime(item.title)}
                    >
                        <Text>{item.title}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});