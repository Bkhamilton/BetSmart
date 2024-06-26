import React, { useContext } from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import useTheme from '@/hooks/useTheme';

import mlb from '@/assets/images/mlb.png';
import nba from '@/assets/images/nba.png';
import nhl from '@/assets/images/nhl.png';
import nfl from '@/assets/images/nfl.png';
import mls from '@/assets/images/mls.png';
import ncaa from '@/assets/images/ncaa.png';
import pga from '@/assets/images/pga.png';
import ufc from '@/assets/images/ufc.png';

export default function SportSlider({ selectLeague }) {

    const { league } = useContext(BetContext);
    const { leagues } = useContext(DBContext);

    const nameToIcon = {
        'NBA': nba,
        'NHL': nhl,
        'MLB': mlb,
        'NFL': nfl,
        'MLS': mls,
        'NCAAB': ncaa,
        'PGA': pga,
        'UFC': ufc,
    }

    const { text, backgroundColor, grayBackground, grayBorder } = useTheme();

    return (
        <View style={{ height: 78, backgroundColor: 'transparent' }}>
            <FlatList
                data={leagues}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[
                            styles.sportContainer,
                            item.leagueName === league?.leagueName && styles.selectedSport,
                            item.leagueName === league.leagueName ? { backgroundColor: text } : { backgroundColor: grayBackground, borderColor: grayBorder },
                        ]}
                        onPress={() => selectLeague(item)}
                    >
                        <Image
                            source={nameToIcon[item.leagueName]}
                            style={styles.logo}
                        />
                        <Text style={[
                            styles.leagueText,
                            item.leagueName === league.leagueName ? { color: backgroundColor } : {}
                        ]}>{item.leagueName}</Text>
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
