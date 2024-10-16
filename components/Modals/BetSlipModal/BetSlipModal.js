import React, { useContext, useState, useEffect } from 'react';
import { bookieImages } from '@/constants/bookieConstants';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { calculateCombinedOdds } from '@/contexts/BetContext/betSlipHelpers';
import { useSQLiteContext } from 'expo-sqlite';
import BetSlip from './BetSlip';
import Banner from './Banner';
import Header from './Header';
import useTheme from '@/hooks/useTheme';
import BookieBanner from './BookieBanner';

export default function BetSlipModal({ visible, close, removeProp, removeBetSlip, confirm }) {

    const { betSlip, bookieId } = useContext(BetContext);
    const { userBalance } = useContext(UserContext);
    const { bookies } = useContext(DBContext);

    const { redText, mainGreen } = useTheme();

    const [wager, setWager] = useState(0);
    const [winnings, setWinnings] = useState(0);

    const [curBookie, setCurBookie] = useState(null);

    const [betSlipOdds, setBetSlipOdds] = useState("Boo!");

    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;

    // Function to convert American odds to decimal odds
    const convertAmericanToDecimalOdds = (americanOdds) => {
        if (americanOdds.startsWith('+')) {
            // For positive odds
            return (parseInt(americanOdds.substring(1), 10) / 100) + 1;
        } else {
            // For negative odds
            return (100 / Math.abs(parseInt(americanOdds, 10))) + 1;
        }
    };

    // Modified getWinnings function
    const getWinnings = (wager) => {
        const decimalOdds = convertAmericanToDecimalOdds(betSlip.odds);
        return (wager * decimalOdds).toFixed(2);
    };

    const onRemove = (bet, leg) => {
        removeProp(bet, leg);
    }

    const onClose = () => {
        setWager(0);
        close();
    }

    const onConfirm = () => {
        // if wager is 0, return
        if (wager === 0) {
            return;
        }
        // if odds doesn't start with + or -, return
        if (!betSlip.odds.startsWith('+') && !betSlip.odds.startsWith('-')) {
            return;
        }
        confirm(wager, getWinnings(wager), curBookie.id);
    }

    const onDismiss = () => {
        setWinnings(getWinnings(wager));
        Keyboard.dismiss();
    }

    // function to cycle through bookies and set curBookie to next bookie
    const onBookieSelect = () => {
        const curIndex = userBalance.findIndex(b => b.bookieId === curBookie.id);
        const nextIndex = curIndex === userBalance.length - 1 ? 0 : curIndex + 1;
        setCurBookie(bookies.find(b => b.id === userBalance[nextIndex].bookieId));
    }

    // add useEffect function to sum up the odds of all the bets in the betSlip
    useEffect(() => {
        const oddsArray = betSlip.bets.map(bet => bet.odds);
        setBetSlipOdds(calculateCombinedOdds(oddsArray));
    }, [betSlip]);

    useEffect(() => {
        setCurBookie(bookies.find(b => b.id === bookieId));
    }, []);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback onPress={onDismiss}>
                <View style={styles.container}>
                    <View style={styles.modalContent}>
                        <Header
                            totalLegs={totalLegs}
                            onClose={onClose}
                        />
                        <ScrollView 
                            style={{ width: '100%' }}
                            showsVerticalScrollIndicator={false}
                        >
                            <BetSlip
                                setBetSlipOdds={setBetSlipOdds}
                                onRemove={onRemove}
                            />
                            <Banner title={"Same Game Parlays"}/>
                            <Banner title={"Straight Bets"}/>
                            <TouchableOpacity 
                                style={{ paddingVertical: 6, width: '100%', backgroundColor: 'pink' }}
                                onPress={removeBetSlip}
                            >
                                <View style={styles.removeContainer}>
                                    <Ionicons name="trash-outline" size={16} color={redText} />
                                    <Text style={{ color: redText }}>Remove all legs</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={styles.confirmContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totalLegs} leg Bet</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontWeight: '500', fontSize: 16 }}>{betSlip.odds}</Text>
                            </View>  
                        </View>
                        {
                            curBookie && ( 
                                <BookieBanner
                                    curBookie={curBookie}
                                    onBookieSelect={onBookieSelect}
                                />
                            )
                        }
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.wagerContainer}>
                                <Text style={{ fontSize: 16 }}>Wager</Text>
                                <View style={styles.wagerInnerContainer}>
                                    <Text style={{ fontSize: 16 }}>$</Text>
                                    <TextInput
                                        style={{ fontSize: 16, width: '80%' }}
                                        placeholder=""
                                        value={wager}
                                        onChangeText={setWager}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <View style={styles.wagerContainer}>
                                <Text style={{ fontSize: 16 }}>To Win</Text>
                                <View style={styles.wagerInnerContainer}>
                                    <Text style={{ fontSize: 16 }}>$</Text>
                                    <Text style={{ fontSize: 16 }}>{getWinnings(wager)}</Text>
                                </View>
                            </View>                        
                        </View>
                        <TouchableOpacity 
                            style={[styles.confirmButtonContainer, { backgroundColor: mainGreen }]}
                            onPress={onConfirm} 
                        >
                            <Text style={{ color: 'white', fontSize: 16 }}>Confirm Bet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: '68%',
        marginTop: 'auto',
        paddingTop: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
    },
    confirmContainer: {
        width: '100%',
        paddingBottom: 20,
    },
    removeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: 'transparent'
    },
    wagerContainer: {
        flex: 1,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
        borderWidth: 1,
        marginHorizontal: 8,
    },
    wagerInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    confirmButtonContainer: {
        padding: 12, 
        borderRadius: 8, 
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
