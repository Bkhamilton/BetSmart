import React, { useContext } from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Text, View, TouchableOpacity, ClearView } from '@/components/Themed';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { SupabaseContext } from '@/contexts/SupabaseContext';
import useTheme from '@/hooks/useTheme';

import { leagueImages } from '@/constants/leagueConstants';

export default function SportSlider({ selectLeague }) {

    const { league } = useContext(BetContext);
    const { leagues } = useContext(SupabaseContext);

    const { text, backgroundColor, grayBackground, grayBorder } = useTheme();

    function renderItem({ item }) {
        return (
            <TouchableOpacity 
                style={[
                    styles.sportContainer,
                    item.leagueName === league?.leagueName && styles.selectedSport,
                    item.leagueName === league.leagueName ? { backgroundColor: text } : { backgroundColor: grayBackground, borderColor: grayBorder },
                ]}
                onPress={() => selectLeague(item)}
            >
                <Image
                    source={leagueImages[item.leagueName]}
                    style={styles.logo}
                />
                <Text style={[
                    styles.leagueText,
                    item.leagueName === league.leagueName ? { color: backgroundColor } : {}
                ]}>{item.leagueName}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <ClearView style={{ height: 78 }}>
            <FlatList
                data={leagues}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </ClearView>
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
