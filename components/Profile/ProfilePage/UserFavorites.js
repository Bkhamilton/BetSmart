import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ScrollView, ClearView } from '@/components/Themed';
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
    
    const [hasBets, setHasBets] = useState(null);

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
            getFavorite(type).then((res) => {
                setFavorite(res);
                // Check if this is the bookie type to determine if user has any bets
                if (type === 'Bookie') {
                    setHasBets(!!res);
                }
            });
        }, []);

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        return (
            <View style={[styles.favoriteContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <ClearView style={{ alignItems: 'center', paddingTop: 4 }}>
                    <Text style={styles.favoriteText}>Top {type}</Text>
                </ClearView>
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
            {hasBets === false ? (
                <View style={[styles.emptyStateContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                    <Text style={styles.emptyStateText}>No bets found</Text>
                    <Text style={styles.emptyStateSubText}>Start placing bets to see your favorites here</Text>
                </View>
            ) : (
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
            )}
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
    emptyStateContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 20,
        marginVertical: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyStateSubText: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        opacity: 0.7,
    },
  });
