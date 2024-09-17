import React, { useContext, useState, useEffect } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Pressable } from '@/components/Themed';
import { getDate, getTime, getAmPm } from '@/utils/dateFunctions';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { calculateCombinedOdds, updateBetOdds } from '@/contexts/BetContext/betSlipHelpers';
import { getBetTargetName, getBetTarget } from '@/db/bet-general/BetTargets';
import { getTeamAbbreviationByName } from '@/db/general/Teams';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function BetSlipModal({ visible, close, removeProp, removeBetSlip, confirm }) {

    const { betSlip, setBetSlip } = useContext(BetContext);

    const { iconColor, redText, mainGreen, grayBackground, grayBorder } = useTheme();

    const [wager, setWager] = useState(0);
    const [winnings, setWinnings] = useState(0);

    const [betSlipOdds, setBetSlipOdds] = useState("Boo!");

    const db = useSQLiteContext();

    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;

    const bookieImages = {
        1: draftkings,
        2: fanduel,
    };

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
        confirm(wager, getWinnings(wager));
    }

    const onDismiss = () => {
        setWinnings(getWinnings(wager));
        Keyboard.dismiss();
    }

    // add useEffect function to sum up the odds of all the bets in the betSlip
    useEffect(() => {
        const oddsArray = betSlip.bets.map(bet => bet.odds);
        setBetSlipOdds(calculateCombinedOdds(oddsArray));
    }, [betSlip]);

    const Leg = ({ leg, currentBet }) => {

        const { type, betTarget, stat, line, overUnder, odds } = leg;

        const [betTargetName, setBetTargetName] = useState('');

        useEffect(() => {
            const fetchName = async () => {
                const name = await getName(leg.betTarget);
                setBetTargetName(name);
            };
    
            fetchName();
        }, []);

        const displayLeg = () => {
            switch (type) {
            case 'Player Points':
                return `${betTarget} ${stat} ${line} ${overUnder}`;
            case 'Player Threes':
                return `${betTarget} ${stat} ${line} ${overUnder}`;
            case 'Main':
                switch (stat) {
                case 'moneyline':
                    return `${betTargetName} ${stat.toUpperCase()}`;
                case 'spread':
                    return `${betTargetName} ${stat} ${line}`;
                case 'total_over_under':
                    return `${betTargetName} Total ${overUnder} ${line}`;
                default:
                    return '';
                }
            default:
                return `${betTarget} ${stat} ${line} ${overUnder}`;
            }
        }

        const getName = async (betTargetId) => {
            const target = await getBetTarget(db, betTargetId);
            if (target.targetType === 'Team') {
                const team = await getTeamAbbreviationByName(db, target.targetName);
                return team.abbreviation;
            } else if (target.targetType === 'Game') {
                return 'Game';
            } else {
                return target.targetName;
            }
        }

        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, paddingVertical: 6, backgroundColor: grayBorder }}>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <Text>{displayLeg()}</Text>
                        <Text style={{ marginLeft: 6 }}>{odds}</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => onRemove(currentBet, leg)}>
                        <Ionicons name="close" size={16} color={redText} />
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    const Bet = ({ bet }) => {

        const numLegs = bet.legs.length;

        const [betOdds, setBetOdds] = useState(bet.odds.slice(1));

        const [lock, setLock] = useState(false);

        const toggleLock = () => {
            const newBetOdds = bet.odds.charAt(0) + betOdds;
            const newBetSlip = updateBetOdds(betSlip, bet, newBetOdds);
            setBetSlip(newBetSlip);
            setBetSlipOdds(newBetSlip.odds);
            setLock(!lock);
        }

        return (
            <Pressable style={[styles.betContainer, { backgroundColor: grayBackground }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', backgroundColor: 'transparent' }}>
                    <Text>{bet.date}</Text>
                    <Text>{bet.league}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 2, backgroundColor: 'transparent' }}>
                    <Text><Text style={{ fontWeight: 'bold' }}>{bet.away}</Text> vs <Text style={{ fontWeight: 'bold' }}>{bet.home}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 8, backgroundColor: 'transparent' }}>
                    <View style={{ flex: 0.2 }}>

                    </View>
                    <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                        <Text style={{ fontWeight: '500' }}>{numLegs} Leg{numLegs > 1 ? 's' : '' }</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2, backgroundColor: 'transparent' }}>
                        <Text style={{ fontSize: 16 }}>{bet.odds.charAt(0)}</Text>
                        <TextInput
                            style={{ fontSize: 16, backgroundColor: 'transparent' }}
                            value={betOdds}
                            onChangeText={setBetOdds}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity 
                            onPress={toggleLock}
                            style={{ paddingHorizontal: 4, backgroundColor: 'transparent' }}
                        >
                            {lock ? <FontAwesome5 name={"lock"} size={16} color={iconColor} /> : <FontAwesome5 name={"unlock"} size={16} color={iconColor} />}
                        </TouchableOpacity>
                    </View>                                        
                </View>
                {bet.legs.map((leg, index) => (
                    <Leg key={index} leg={leg} currentBet={bet}/>
                ))}
            </Pressable>
        );
    }

    const Banner = ({ title }) => {
        return (
            <View style={{ paddingVertical: 6, width: '100%' }}>
                <TouchableOpacity style={styles.propContainer}>
                    <View style={{ justifyContent: 'center', paddingHorizontal: 8, }}>
                        <FontAwesome5 name={"chevron-down"} size={16} color={iconColor} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16 }}>{title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const BetSlip = () => {
        return (
            <>
                {betSlip.bets.map((bet, index) => (
                    <Bet key={index} bet={bet} />
                ))}
            </>
        );
    }

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
                        <View style={styles.headerContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={[styles.legsContainer, { backgroundColor: mainGreen }]}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{totalLegs}</Text>
                                </View>
                                <Text style={styles.modalText}>Bet Slip</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{betSlip.odds}</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView 
                            style={{ width: '100%' }}
                            showsVerticalScrollIndicator={false}
                        >
                            <BetSlip />
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
                        <TouchableOpacity 
                            style={[styles.bookieSelectContainer, { backgroundColor: mainGreen }]}
                        >
                            <Image source={bookieImages[betSlip.bookieId]} style={{ width: 32, height: 32, borderRadius: 4 }}/>
                        </TouchableOpacity>
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
    headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        borderBottomWidth: 1,
    },
    modalText: {
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: 'pink',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    confirmContainer: {
        width: '100%',
        paddingBottom: 20,
    },
    propContainer: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
    },
    removeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: 'transparent'
    },
    legsContainer: {
        borderWidth: 1, 
        borderRadius: 15, 
        height: 30, 
        width: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
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
    betContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingTop: 8,
    },
    confirmButtonContainer: {
        padding: 12, 
        borderRadius: 8, 
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookieSelectContainer: {
        padding: 10, 
        borderRadius: 8, 
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
