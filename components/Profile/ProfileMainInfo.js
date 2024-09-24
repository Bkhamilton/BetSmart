import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getTotalBetSlips } from '@/db/betslips/BetSlips';
import { getBetSlipResultsWinnings } from '@/db/betslips/BetSlipsResults';
import { TouchableOpacity, Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function ProfileMainInfo({ user }) {

    const { id, name, email, username, password } = user;

    const [totalBets, setTotalBets] = useState(0);
    const [totalWinnings, setTotalWinnings] = useState(0);

    const db = useSQLiteContext();

    useEffect(() => {
        getTotalBetSlips(db, id)
            .then((total) => setTotalBets(total))
            .catch((error) => console.error('Error getting total bet slips:', error));

        getBetSlipResultsWinnings(db, id)
            .then((winnings) => setTotalWinnings(winnings[0].totalWinnings))
            .catch((error) => console.error('Error getting total winnings:', error));
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text>{totalBets} Bets</Text>
                    <Text>${totalWinnings} All Time</Text>
                </View>
                <View style={{ paddingVertical: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
                </View>
                <Text style={{ fontSize: 16 }}>{username}</Text>
            </View>
            <View style={{ paddingVertical: 12 }}>
                <View style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 1 }}/>
            </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingLeft: 20,
        paddingVertical: 16,
    },
  });
