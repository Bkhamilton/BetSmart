import React, { useContext } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Pressable } from '@/components/Themed';
import { getDate, getTime, getAmPm } from '@/utils/dateFunctions';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function BetSlipModal({ visible, close }) {

    const { betSlip, currentGame } = useContext(BetContext);

    const { iconColor, redText, mainGreen } = useTheme();

    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;

    const Leg = ({ leg }) => {

        const { type, betTarget, stat, line, overUnder } = leg;

        const displayLeg = () => {
            switch (type) {
            case 'Player Points':
                return `${betTarget} ${stat} ${line} ${overUnder}`;
            case 'Player Threes':
                return `${betTarget} ${stat} ${line} ${overUnder}`;
            case 'Main':
                switch (stat) {
                case 'moneyline':
                    return `${line} ${stat.toUpperCase()}`;
                case 'spread':
                    return `${betTarget} ${stat} ${line}`;
                case 'total_over_under':
                    return `${stat} ${line}`;
                default:
                    return '';
                }
            default:
                return '';
            }
        }

        return (
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, paddingVertical: 4 }}>
                    <Text>{displayLeg()}</Text>
                    <TouchableOpacity>
                        <Ionicons name="close" size={16} color={redText} />
                    </TouchableOpacity>
                </View>

            </>
        );
    }

    const Bet = ({ bet }) => {

        const numLegs = bet.legs.length;

        return (
            <Pressable style={styles.betContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text>{bet.date}</Text>
                    <Text>{bet.league}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text><Text style={{ fontWeight: 'bold' }}>{bet.away}</Text> vs <Text style={{ fontWeight: 'bold' }}>{bet.home}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 8 }}>
                    <View>

                    </View>
                    <View>
                        <Text style={{ fontWeight: '500' }}>{numLegs} Leg{numLegs > 1 ? 's' : '' }</Text>
                    </View>
                    <View>
                        <Text>{bet.odds}</Text>
                    </View>                                        
                </View>
                {bet.legs.map((leg, index) => (
                    <Leg key={index} leg={leg} />
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                    onPress={close}
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
                            <TouchableOpacity style={{ paddingVertical: 6, borderWidth: 1, width: '100%' }}>
                                <View style={styles.removeContainer}>
                                    <Ionicons name="trash-outline" size={16} color={redText} />
                                    <Text style={{ color: redText }}>Remove all legs</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={styles.confirmContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{totalLegs} leg Bet</Text>
                            <Text style={{ fontWeight: '500' }}>{betSlip.odds}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.wagerContainer}>
                                <Text style={{ fontSize: 16 }}>Wager</Text>
                                <View style={styles.wagerInnerContainer}>
                                    <Text style={{ fontSize: 16 }}>$</Text>
                                    <TextInput
                                        style={{ fontSize: 16, borderWidth: 1, width: '80%' }}
                                        placeholder=""
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <View style={styles.wagerContainer}>
                                <Text style={{ fontSize: 16 }}>To Win</Text>
                                <View style={styles.wagerInnerContainer}>
                                    <Text style={{ fontSize: 16 }}>$</Text>
                                    <Text></Text>
                                </View>
                            </View>                        
                        </View>
                        <TouchableOpacity style={{ paddingVertical: 8, backgroundColor: mainGreen, borderRadius: 8 }}>
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
        height: '75%',
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
        borderColor: 'green',
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
        paddingVertical: 8,
    },
});
