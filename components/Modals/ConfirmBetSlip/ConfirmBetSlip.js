import React, { useEffect, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { TouchableOpacity, Text, View, Modal, ClearView, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { getDateFull } from '@/utils/dateFunctions';
import ResolveComponent from './ResolveComponent';
import LegComponent from '../../Home/BetReview/DetailedInfo/LegComponent';

export default function ConfirmBetSlip({ visible, close, betSlip, confirm }) {
    const { redText, mainGreen, backgroundColor, grayBackground, text } = useTheme();
    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;
    const [resolvedLegs, setResolvedLegs] = useState(Array(totalLegs).fill(null));
    const [progressAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        setResolvedLegs(Array(totalLegs).fill(null));
    }, [betSlip]);

    useEffect(() => {
        // Animate progress when resolved legs change
        const resolvedCount = resolvedLegs.filter(leg => leg !== null).length;
        Animated.timing(progressAnim, {
            toValue: resolvedCount / totalLegs,
            duration: 300,
            useNativeDriver: false
        }).start();
    }, [resolvedLegs]);

    const handleLegResolved = (index, result) => {
        setResolvedLegs(prev => {
            const newResolvedLegs = [...prev];
            newResolvedLegs[index] = result;
            return newResolvedLegs;
        });
    };

    const handleBetResolved = (bet) => {
        // A bet is won if all legs are either won (1) or pushed (-1), and at least one is won
        const hasWinningLegs = bet.legs.some(leg => leg.result === 1);
        const allLegsResolved = bet.legs.every(leg => leg.result !== null);
        const noLosingLegs = bet.legs.every(leg => leg.result !== 0);
        
        return allLegsResolved && noLosingLegs && hasWinningLegs;
    };

    const handleConfirm = () => {
        // Overall bet result is true if all non-pushed legs are won (1)
        const nonPushedLegs = resolvedLegs.filter(leg => leg !== -1);
        betSlip['result'] = nonPushedLegs.length > 0 && nonPushedLegs.every(leg => leg === 1);
        
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
        const { grayBackground, redText, mainGreen, backgroundColor, yellowText } = useTheme();
        const [result, setResult] = useState(null);
        
        const resolve = (res) => {
            leg['result'] = res;
            setResult(res);
            resolveLeg(legIndex, res);
        };

        return (
            <LegComponent leg={leg}>
                <View style={styles.resultsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            result === -1 && styles.pushButton,
                            { 
                                backgroundColor: result === -1 ? yellowText : backgroundColor,
                                borderColor: yellowText
                            },
                        ]}
                        onPress={() => resolve(-1)}
                    >
                        <Feather
                            name="minus"
                            size={24}
                            color={result === -1 ? backgroundColor : yellowText}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            result === false && styles.lostButton,
                            { backgroundColor: result === false ? redText : backgroundColor },
                        ]}
                        onPress={() => resolve(0)}
                    >
                        <Feather
                            name="x"
                            size={24}
                            color={result === false ? backgroundColor : redText}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            result === true && styles.wonButton,
                            { backgroundColor: result === true ? mainGreen : backgroundColor },
                        ]}
                        onPress={() => resolve(1)}
                    >
                        <Feather
                            name="check"
                            size={24}
                            color={result === true ? backgroundColor : mainGreen}
                        />
                    </TouchableOpacity>
                </View>
            </LegComponent>
        );
    }; 
      
    const BetComponent = ({ bet, resolveLeg }) => {
        return (
            <ClearView style={styles.betContainer}>
                <ClearView style={styles.betHeader}>
                    <Text style={styles.betLeague}>{bet.league}</Text>
                    <Text style={styles.betOdds}>{bet.odds}</Text>
                </ClearView>
                <ClearView style={styles.betDateContainer}>
                    <Text style={styles.betDate}>{bet.date}</Text>
                </ClearView>
                <ClearView style={styles.matchupContainer}>
                    <Text style={styles.matchupText}>{bet.homeTeamAbv} vs {bet.awayTeamAbv}</Text>
                </ClearView>
                {bet.legs.map((leg, index) => (
                    <Leg key={index} leg={leg} legIndex={legIndex++} resolveLeg={resolveLeg}/>
                ))}
            </ClearView>
        );
    };

    const resolvedCount = resolvedLegs.filter(leg => leg !== null).length;
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
            style={styles.modalContainer}
        >
            <View style={styles.container}>
                <View style={[styles.innerContainer, { backgroundColor }]}>
                    <View style={styles.headerContainer}>
                        <View style={styles.dateOddsContainer}>
                            <Text style={styles.betText}>{getDateFull(betSlip.date)}</Text>
                            <Text style={styles.betText}>{betSlip.odds}</Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.closeButton, { backgroundColor: redText }]}
                            onPress={handleClose}
                        >
                            <Feather name="x" size={18} color={backgroundColor} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.stakeContainer}>
                        <View style={styles.stakeBox}>
                            <Text style={styles.stakeLabel}>Bet</Text>
                            <Text style={styles.stakeAmount}>${betSlip.betAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.stakeBox}>
                            <Text style={styles.stakeLabel}>To Win</Text>
                            <Text style={styles.stakeAmount}>${betSlip.winnings.toFixed(2)}</Text>
                        </View>
                    </View>

                    <ScrollView 
                        style={{ width: '100%', maxHeight: 400 }} 
                        showsVerticalScrollIndicator={false}
                    >
                    {betSlip.bets.map((betDetail, index) => (
                        <BetComponent key={index} bet={betDetail} resolveLeg={handleLegResolved}/>
                    ))}
                    </ScrollView>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBackground}>
                            <Animated.View 
                                style={[
                                    styles.progressBar,
                                    { width: progressWidth }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {resolvedCount} of {totalLegs} legs resolved
                        </Text>
                    </View>

                    {resolvedCount === totalLegs && (
                        <ResolveComponent 
                            resolvedLegs={resolvedLegs} 
                            totalLegs={totalLegs} 
                            handleConfirm={handleConfirm}
                            hasPushedLegs={resolvedLegs.includes(-1)}
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
        padding: 16,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateOddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stakeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    stakeBox: {
        width: '48%',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    stakeLabel: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 4,
    },
    stakeAmount: {
        fontSize: 18,
        fontWeight: '600',
    },
    betContainer: {
        marginBottom: 16,
        borderBottomWidth: 1,
        paddingBottom: 12,
    },
    betHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    betLeague: {
        fontWeight: '600',
    },
    betOdds: {
        fontWeight: '600',
        color: '#2ecc71',
    },
    betDateContainer: {
        marginBottom: 8,
    },
    betDate: {
        fontSize: 12,
        opacity: 0.7,
    },
    matchupContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    matchupText: {
        fontSize: 18,
        fontWeight: '600',
    },
    resultsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginLeft: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wonButton: {
        borderColor: '#2ecc71',
    },
    lostButton: {
        borderColor: '#e74c3c',
    },
    pushButton: {
        borderColor: '#f39c12',
    },
    progressContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    progressBackground: {
        height: 6,
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2ecc71',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '500',
    },
    betText: {
        fontSize: 16,
        fontWeight: '500',
    },
});