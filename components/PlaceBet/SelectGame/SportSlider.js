import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SportSlider({ sports, selectSport, curSport }) {

    const { mainBlue, text, borderColor, iconColor } = useTheme();

    return (
        <View style={{ height: 78, backgroundColor: 'transparent' }}>
            <FlatList
                data={sports}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[
                            styles.sportContainer,
                            item.title === curSport?.title && styles.selectedSport,
                            item.title === curSport.title ? { backgroundColor: text } : {}
                        ]}
                        onPress={() => selectSport(item)}
                    >
                        <Image
                            source={item.icon}
                            style={styles.logo}
                        />
                        <Text style={[
                            styles.leagueText,
                            item.title === curSport.title ? { color: borderColor } : {}
                        ]}>{item.title}</Text>
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
    },
    selectedSport: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leagueText: {
        fontWeight: '500',
        opacity: 0.8,
    }
});
