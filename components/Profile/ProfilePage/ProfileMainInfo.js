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

export default function ProfileMainInfo({ handleSignIn }) {
    const { user, signedIn } = useContext(UserContext);
    const { db } = useContext(DBContext);
    const [totalBets, setTotalBets] = useState(0);
    const [totalWinnings, setTotalWinnings] = useState(0);
    const { iconColor, grayBackground, grayBorder } = useTheme();
    const { handleEditProfile } = useRouting();

    useEffect(() => {
        if (!signedIn || !user?.id) {  // Changed to use optional chaining
            setTotalBets(0);
            setTotalWinnings(0);
            return;
        }
        
        getTotalBetSlips(db, user.id)  // Use user.id instead of destructured id
            .then((total) => setTotalBets(total))
            .catch((error) => console.error('Error getting total bet slips:', error));

        getBetSlipResultsWinnings(db, user.id)  // Use user.id here too
            .then((winnings) => setTotalWinnings(winnings[0].totalWinnings ? winnings[0].totalWinnings.toFixed(2) : 0))
            .catch((error) => console.error('Error getting total winnings:', error));
    }, [user, signedIn]);

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <View style={{ paddingVertical: 4, marginBottom: 8 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {signedIn ? user?.name : 'No User'}  {/* Use optional chaining */}
                    </Text>
                </View>
                <Text style={{ fontSize: 16, marginBottom: 12 }}>{signedIn ? user?.username : ''}</Text>
                
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                        <Text style={styles.statValue}>{totalBets}</Text>
                        <Text style={styles.statLabel}>Total Bets</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                        <Text style={styles.statValue}>${totalWinnings}</Text>
                        <Text style={styles.statLabel}>All Time</Text>
                    </View>
                </View>

                <View style={{ marginTop: 12 }}>
                    {signedIn ? (
                        <TouchableOpacity 
                            style={[styles.editProfileButton, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                            onPress={handleEditProfile}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Edit Profile</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={[styles.editProfileButton, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                            onPress={handleSignIn}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={{ paddingVertical: 12 }}>
                <View style={styles.profileIcon}>
                    <FontAwesome6 name="user-large" size={80} color={iconColor} style={{ opacity: signedIn ? 1 : 0.4 }}/>
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
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 4,
    },
    statCard: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    editProfileButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    profileIcon: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
    }
  });
