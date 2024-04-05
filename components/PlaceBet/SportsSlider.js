import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Text, View, TouchableOpacity } from '../Themed';

import Colors from '@/constants/Colors';

export default function SportSlider({ sports, selectSport }) {

    return (
        <View style={{ height: 76 }}>
            <FlatList
                data={sports}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.sportContainer}
                        onPress={() => selectSport(item)}
                    >
                        <Image
                            source={item.icon}
                            style={styles.logo}
                        />
                        <Text style={{ opacity: 0.8 }}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
  );
}

const styles = StyleSheet.create({
    sportContainer: {
        borderWidth: 1,
        borderRadius: 8,
        height: 72,
        width: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    logo: {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
    }
});
