import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { Feather } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { getDateFull } from '@/utils/dateFunctions';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function ConfirmBetSlip({ visible, close, betSlip, confirm }) {

    const { iconColor, grayBackground, grayBorder, mainGreen, redText, backgroundColor } = useTheme();

    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;

    const [resolvedLegs, setResolvedLegs] = useState(Array(totalLegs).fill(null));

    useEffect(() => {
        // Reset resolvedLegs state when betslip changes
        setResolvedLegs(Array(totalLegs).fill(null));
    }, [betSlip]);

    const handleLegResolved = (index, result) => {
        setResolvedLegs(prev => {
          const newResolvedLegs = [...prev];
          newResolvedLegs[index] = result;
          return newResolvedLegs;
        });
    };

    // Function to handle Bet Resolved based on leg results
    const handleBetResolved = (bet) => {
        const resolvedLegs = bet.legs.map(leg => leg.result);
        return resolvedLegs.every(leg => leg === true);
    };

    const handleConfirm = () => {
        betSlip['result'] = resolvedLegs.every(leg => leg === true);
        betSlip.bets.forEach(bet => {
            bet['result'] = handleBetResolved(bet);
        });
        confirm(betSlip);
    };

    let legIndex = 0;

    const LegComponent = ({ leg, legIndex, resolveLeg }) => {
        
        const [results, setResults] = useState(null);

        const displayLegInfo = (leg) => {
        const isWholeNumber = 'line' in leg && (Number.isInteger(parseFloat(leg.value)) || parseFloat(leg.value) % 1 === 0);
        
        if ('overUnder' in leg && 'line' in leg) {
            if (isWholeNumber) {
            return `${leg.value}+ ${leg.marketType}`;
            } else {
            return `${leg.overUnder} ${leg.value} ${leg.marketType}`;
            }
        } else if ('line' in leg) {
            if (isWholeNumber) {
            return `${leg.value}+ ${leg.marketType}`;
            } else {
            return `${leg.value} ${leg.marketType}`;
            }
        } else {
            return `${leg.betTarget} ${leg.marketType} ${leg.value}`;
        }
        };
    
        const resolve = (result) => {
            leg['result'] = result;
            setResults(result);
            resolveLeg(legIndex, result);
        };

        return (
            <View style={{ backgroundColor: 'transparent' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1 }}/>
                    <View style={{ backgroundColor: 'transparent', paddingLeft: 4, }}>
                        <Text style={{ fontWeight: '600' }}>{leg.betTarget}</Text>
                        <Text>{displayLegInfo(leg)}</Text>
                    </View>
                </View>
                <View style={[styles.resultsContainer, { backgroundColor: results === null ? 'transparent' : results ? redText : 'green' }]}>
                    <TouchableOpacity 
                        style={[styles.iconButton, { backgroundColor: results === false ? grayBackground : backgroundColor }]}
                        onPress={() => resolve(false)}
                    >
                        <Feather name="x" size={24} color={redText} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.iconButton, { backgroundColor: results === true ? grayBackground : backgroundColor }]}
                        onPress={() => resolve(true)}
                    >
                        <Feather name="check" size={24} color="green" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }; 
      
    const BetComponent = ({ bet, resolveLeg }) => {
        return (
        <View style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <Text>{bet.league}</Text>
                <Text>{bet.odds}</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{bet.homeTeamAbv} vs {bet.awayTeamAbv}</Text>
            </View>
            {
                bet.legs.map((leg, index) => (
                    <LegComponent key={index} leg={leg} legIndex={legIndex++} resolveLeg={resolveLeg}/>
                ))
            }
        </View>
        );
    }; 

    const ResolveComponent = ({ close }) => {

        const trueLegs = resolvedLegs.filter(leg => leg === true).length;
        const falseLegs = resolvedLegs.filter(leg => leg === false).length;

        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 8, borderWidth: 1, borderRadius: 8 }}>
                    <Text>{trueLegs}/{totalLegs} Legs Won</Text>
                    <View>
                        {trueLegs === totalLegs ? (
                            <Text>Bet Won!</Text>
                        ) : (
                            <Text>Bet Lost! :(</Text>
                        )}
                    </View>
                </View>
                <TouchableOpacity 
                    style={{ width: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingVertical: 6, backgroundColor: mainGreen }}
                    onPress={handleConfirm}
                >
                    <Text>Confirm Bet</Text>
                </TouchableOpacity>
            </>
        );
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
            style={styles.modalContainer}
        >
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.betText}>{getDateFull(betSlip.date)}</Text>
                    <Text style={styles.betText}>{betSlip.odds}</Text>
                </View>
                <TouchableOpacity 
                    style={{ width: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingVertical: 6, backgroundColor: redText }}
                    onPress={close}
                >
                    <Text>Close</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <Text style={styles.betText}>Bet</Text>
                        <Text style={styles.betText}>${betSlip.betAmount.toFixed(2)}</Text>
                    </View>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <Text style={styles.betText}>To Win</Text>
                        <Text style={styles.betText}>${betSlip.winnings.toFixed(2)}</Text>
                    </View>
                </View>
                {betSlip.bets.map((betDetail, index) => (
                    <BetComponent key={index} bet={betDetail} resolveLeg={handleLegResolved}/>
                ))}
                <View>
                    <Text>
                    {resolvedLegs.filter(leg => leg !== null).length} / {totalLegs} Legs Resolved 
                    </Text>
                </View>
                {resolvedLegs.filter(leg => leg !== null).length === totalLegs && (
                    <ResolveComponent close={close}/>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookieButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    closeButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    balanceText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 80,
    },
    titleContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: 'transparent', 
        width: '100%',
        paddingHorizontal: 16,
    },
    iconButton: {
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        margin: 4,
    },
    resultsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderRadius: 8,
    }
});