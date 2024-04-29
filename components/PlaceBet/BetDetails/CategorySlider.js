import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ScrollView, Pressable } from '@/components/Themed';

export default function CategorySlider({ selectCategory, curCategory }) {

    const categories = [
        {
          title: 'Main',
          id: 1,
        },
        {
          title: 'Alt Main',
          id: 2,
        },
        {
          title: 'Player Points',
          id: 3,
        },
        {
          title: 'Player Rebounds',
          id: 4,
        },
        {
          title: 'Player Assists',
          id: 5,
        },
        {
          title: 'Player Threes',
          id: 6,
        },
        {
          title: 'Player Combos',
          id: 7,
        },
        {
          title: 'Player Defense',
          id: 8,
        },
        {
          title: 'Stat Leaders',
          id: 9,
        },
        {
          title: 'Half',
          id: 10,
        },
        {
          title: 'Quarters',
          id: 11,
        },
        {
          title: 'Team Props',
          id: 12,
        },
        {
          title: 'Game Props',
          id: 13,
        },
    ]

    return (
        <View style={styles.container}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}  
          >
            {categories.map((item) => (
              <Pressable
                key={item.id}
                style={styles.categoryContainer}
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