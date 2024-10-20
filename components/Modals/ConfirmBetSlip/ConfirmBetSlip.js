import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Modal, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { getDateFull } from '@/utils/dateFunctions';
import ResolveComponent from './ResolveComponent';
import LegComponent from '../../Home/BetReview/DetailedInfo/LegComponent';

export default function ConfirmBetSlip({ visible, close, betSlip, confirm }) {

    const { redText, mainGreen } = useTheme();

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

    const handleClose = () => {
        setResolvedLegs(Array(totalLegs).fill(null));
        close();
    };

    let legIndex = 0;

    const Leg = ({ leg, legIndex, resolveLeg }) => {

        const { grayBackground, redText, backgroundColor } = useTheme();

        const [results, setResults] = useState(null);
        
        const resolve = (result) => {
            leg['result'] = result;
            setResults(result);
            resolveLeg(legIndex, result);
        };
    
        return (
            <LegComponent leg={leg}>
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
            </LegComponent>
        );
    }; 
      
    const BetComponent = ({ bet, resolveLeg }) => {
        return (
            <ClearView>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{bet.league}</Text>
                    <Text>{bet.odds}</Text>
                </ClearView>
                <ClearView>
                    <Text>{bet.date}</Text>
                </ClearView>
                <ClearView style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{bet.homeTeamAbv} vs {bet.awayTeamAbv}</Text>
                </ClearView>
                {
                    bet.legs.map((leg, index) => (
                        <Leg key={index} leg={leg} legIndex={legIndex++} resolveLeg={resolveLeg}/>
                    ))
                }
            </ClearView>
        );
    }; 

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
            style={styles.modalContainer}
        >
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.betText}>{getDateFull(betSlip.date)}</Text>
                        <Text style={styles.betText}>{betSlip.odds}</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.closeButton, { backgroundColor: redText }]}
                        onPress={handleClose}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <ClearView>
                            <Text style={styles.betText}>Bet</Text>
                            <Text style={styles.betText}>${betSlip.betAmount.toFixed(2)}</Text>
                        </ClearView>
                        <ClearView>
                            <Text style={styles.betText}>To Win</Text>
                            <Text style={styles.betText}>${betSlip.winnings.toFixed(2)}</Text>
                        </ClearView>
                    </View>
                    {betSlip.bets.map((betDetail, index) => (
                        <BetComponent key={index} bet={betDetail} resolveLeg={handleLegResolved}/>
                    ))}
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text>
                        {resolvedLegs.filter(leg => leg !== null).length} / {totalLegs} Legs Resolved 
                        </Text>
                    </View>
                    {resolvedLegs.filter(leg => leg !== null).length === totalLegs && (
                        <ResolveComponent 
                            resolvedLegs={resolvedLegs} 
                            totalLegs={totalLegs} 
                            handleConfirm={handleConfirm}
                        />
                    )}
                </View>
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '80%',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 8,
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
    closeButton: {
        width: '100%', 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 6,
    },
    titleContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: 'transparent', 
        width: '100%',
        paddingHorizontal: 16,
    },
    resultsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderRadius: 8,
    },
    iconButton: {
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        margin: 4,
    },
});