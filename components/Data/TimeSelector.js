import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ScrollView, Pressable } from '@/components/Themed';

export default function TimeSelector({ selectTime, curTime }) {

    const timeSlots = [
        {
            title: 'Open',
            id: 1,
        },
        {
            title: '1D',
            id: 2,
        },
        {
            title: '1W',
            id: 3,
        },
        {
            title: '2W',
            id: 4,
        },
        {
            title: '1M',
            id: 5,
        },
        {
            title: '3M',
            id: 6,
        },
        {
            title: '6M',
            id: 7,
        },
        {
            title: '1Y',
            id: 8,
        },
        {
            title: 'All',
            id: 9,
        }
    ]

    return (
        <View style={styles.container}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}  
          >
            {timeSlots.map((item) => (
              <Pressable
                key={item.id}
                style={styles.categoryContainer}
                onPress={() => selectTime(item.title)}
              >
                <Text style={{ color: 'white' }}>{item.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
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
        backgroundColor: 'gray',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
});