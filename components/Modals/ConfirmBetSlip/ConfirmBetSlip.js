import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Modal, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { getDateFull } from '@/utils/dateFunctions';
import ResolveComponent from './ResolveComponent';
import Bet from './Bet';

export default function ConfirmBetSlip({ visible, close, betSlip, confirm }) {

    const { redText } = useTheme();

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

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
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
                        onPress={close}
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
                        <Bet key={index} bet={betDetail} resolveLeg={handleLegResolved} legIndex={legIndex}/>
                    ))}
                    <View>
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
});