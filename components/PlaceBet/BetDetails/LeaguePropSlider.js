import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';

import useTheme from '@/hooks/useTheme';

export default function LeaguePropSlider({ leagueProps, selectLeagueProp, curLeagueProp }) {
    const [pressedId, setPressedId] = useState(null);

    const { grayBackground, iconColor, text, grayText } = useTheme();

    return (
        <View style={styles.container}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: grayBackground }}  
          >
            {leagueProps.map((item) => {
              const color = curLeagueProp === item.propName ? text : grayText;
              return (
                <Pressable
                  key={item.id}
                  onPressIn={() => setPressedId(item.id)}
                  onPressOut={() => setPressedId(null)}
                  onPress={() => selectLeagueProp(item.propName)}
                  style={({pressed}) => ({
                    ...styles.categoryContainer,
                  })}
                >
                  <Text style={{ color: pressedId === item.id ? text : color, fontWeight: curLeagueProp === item.propName ? '600' : '400' }}>{item.propName}</Text>
                </Pressable>
              );
            })}
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
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    categoryContainer: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
});