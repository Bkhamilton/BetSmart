import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getTotalBetSlips } from '@/db/betslips/BetSlips';
import { getBetSlipResultsWinnings } from '@/db/betslips/BetSlipsResults';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import { FontAwesome6 } from '@expo/vector-icons';

export default function ProfileMainInfo() {

    const { user, signedIn } = useContext(UserContext);

    const { db } = useContext(DBContext);

    const { id, name, email, username, password } = user;

    const [totalBets, setTotalBets] = useState(0);
    const [totalWinnings, setTotalWinnings] = useState(0);

    const { iconColor, grayBackground, grayBorder } = useTheme();

    const { handleEditProfile } = useRouting();

    useEffect(() => {
        if (!signedIn) return;
        if (!id) return;
        if (id === 0) return;
        getTotalBetSlips(db, id)
            .then((total) => setTotalBets(total))
            .catch((error) => console.error('Error getting total bet slips:', error));

        getBetSlipResultsWinnings(db, id)
            .then((winnings) => setTotalWinnings(winnings[0].totalWinnings ? winnings[0].totalWinnings.toFixed(2) : 0))
            .catch((error) => console.error('Error getting total winnings:', error));
    }, [user, signedIn]);

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
                <View style={{ marginTop: 8 }}>
                    <TouchableOpacity 
                        style={[styles.editProfileButton, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                        onPress={handleEditProfile}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ paddingVertical: 12 }}>
                <View style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 1, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                    <FontAwesome6 name="user-large" size={80} color={iconColor} />
                </View>
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
    editProfileButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    }
  });
