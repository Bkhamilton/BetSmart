import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function UserFavorites({ league, team, player, sportsbook, bet }) {

    const { grayBackground, grayBorder } = useTheme();

    const FavoriteComponent = ({ type }) => {
        return (
            <View style={[styles.favoriteContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <View style={{ alignItems: 'center', backgroundColor: 'transparent', paddingTop: 4 }}>
                    <Text style={styles.favoriteText}>Top {type}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Favorites</Text>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ paddingVertical: 12, paddingLeft: 20 }}
            >
                <FavoriteComponent type="League" />
                <FavoriteComponent type="Team" />
                <FavoriteComponent type="Player" />
                <FavoriteComponent type="Bookie" />
                <FavoriteComponent type="Bet" />
            </ScrollView>
        </View>
    );
  
}

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 0,
    },
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
