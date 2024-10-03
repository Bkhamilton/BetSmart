import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import { getFavoriteBookie } from '@/db/betslips/BetSlips';
import { getFavoriteLeague, getFavoriteTeam } from '@/db/betslips/ParticipantBets';
import { getFavoriteBetType } from '@/db/betslips/Legs';

import { bookieImages } from '@/constants/bookieConstants'; 
import { leagueImages } from '@/constants/leagueConstants';

export default function UserFavorites({ player }) {

    const { user } = useContext(UserContext);

    const db = useSQLiteContext();

    const { grayBackground, grayBorder } = useTheme();

    const getFavorite = async (type) => {
        switch (type) {
            case 'League':
                return getFavoriteLeague(db, user.id);
            case 'Team':
                return getFavoriteTeam(db, user.id);
            case 'Player':
                return player;
            case 'Bookie':
                return getFavoriteBookie(db, user.id);
            case 'Bet':
                return getFavoriteBetType(db, user.id);
            default:
                return null;
        }
    }

    const getFavoriteImage = (type, favorite) => {
        switch (type) {
            case 'League':
                return <Image source={leagueImages[favorite.name]} style={{ width: 70, height: 70, borderRadius: 8 }}/>;
            case 'Team':
                return <Image source={{ uri: favorite.logoUrl }} style={{ width: 70, height: 70, borderRadius: 8 }}/>
            case 'Player':
                return <View style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: grayBorder, padding: 8 }}/>;
            case 'Bookie':
                return <Image source={bookieImages[favorite.name]} style={{ width: 70, height: 70, borderRadius: 8 }}/>;
            case 'Bet':
                return <View style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: grayBorder, padding: 8 }}/>;
            default:
                return <View style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: grayBorder, padding: 8 }}/>;
        }
    }

    const FavoriteComponent = ({ type, displayType }) => {

        const [favorite, setFavorite] = useState(null);

        useEffect(() => {
            getFavorite(type).then((res) => setFavorite(res));
        }, []);

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        return (
            <View style={[styles.favoriteContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <View style={{ alignItems: 'center', backgroundColor: 'transparent', paddingTop: 4 }}>
                    <Text style={styles.favoriteText}>Top {type}</Text>
                </View>
                <ClearView style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
                    { 
                        favorite && getFavoriteImage(type, favorite)
                    }
                    <Text style={{ fontSize: 14, fontWeight: '600', marginTop: 8 }}>{favorite?.name}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginTop: 2 }}>{favorite?.count} {displayType}</Text>
                </ClearView>
            </View>
        );
    };

    return (
        <>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Favorites</Text>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ paddingVertical: 12, paddingLeft: 12 }}
            >
                <FavoriteComponent type="Bookie" displayType="Bets"/>
                <FavoriteComponent type="League" displayType="Bets"/>
                <FavoriteComponent type="Team" displayType="Bets"/>
                <FavoriteComponent type="Bet" displayType="Legs"/>
                <FavoriteComponent type="Player" displayType="Bets"/>
            </ScrollView>
        </>
    );
  
}

  const styles = StyleSheet.create({
    favoriteContainer: {
        borderWidth: 1,
        borderRadius: 8,
        width: 120,
        height: 160,
        marginRight: 8,
    },
    favoriteText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
  });
