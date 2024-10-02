import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import { getFavoriteBookie } from '@/db/betslips/BetSlips';
import { getFavoriteLeague } from '@/db/betslips/ParticipantBets';

export default function UserFavorites({ league, team, player, sportsbook, bet }) {

    const { user } = useContext(UserContext);

    const db = useSQLiteContext();

    const { grayBackground, grayBorder } = useTheme();

    const getFavorite = async (type) => {
        switch (type) {
            case 'League':
                return getFavoriteLeague(db, user.id);
            case 'Team':
                return team;
            case 'Player':
                return player;
            case 'Bookie':
                return getFavoriteBookie(db, user.id);
            case 'Bet':
                return bet;
            default:
                return null;
        }
    }

    const FavoriteComponent = ({ type }) => {

        const [favorite, setFavorite] = useState(null);

        useEffect(() => {
            getFavorite(type).then((res) => setFavorite(res));
        }, []);

        return (
            <View style={[styles.favoriteContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <View style={{ alignItems: 'center', backgroundColor: 'transparent', paddingTop: 4 }}>
                    <Text style={styles.favoriteText}>Top {type}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{JSON.stringify(favorite)}</Text>
                </View>
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
                <FavoriteComponent type="League" />
                <FavoriteComponent type="Team" />
                <FavoriteComponent type="Player" />
                <FavoriteComponent type="Bookie" />
                <FavoriteComponent type="Bet" />
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
