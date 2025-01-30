import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Pressable, TextInput, ClearView } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { updateBetOdds } from '@/contexts/BetContext/betSlipHelpers';
import Leg from './Leg';
import useTheme from '@/hooks/useTheme';

export default function Bet({ bet, setBetSlipOdds, remove }) {

    const { betSlip, setBetSlip } = React.useContext(BetContext);

    const { grayBackground, iconColor, backgroundColor } = useTheme();

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

    const onRemove = (bet, leg) => {
        remove(bet, leg);
        setBetOdds(bet.odds.slice(1));
    }

    useEffect(() => {
        setBetOdds(bet.odds.slice(1));
    }, [bet]);

    return (
        <Pressable 
            style={[styles.betContainer, { backgroundColor: grayBackground, borderColor: backgroundColor }]}
        >
            <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text>{bet.date}</Text>
                <Text>{bet.league}</Text>
            </ClearView>
            <ClearView style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 2 }}>
                <Text><Text style={{ fontWeight: 'bold' }}>{bet.away}</Text> vs <Text style={{ fontWeight: 'bold' }}>{bet.home}</Text></Text>
            </ClearView>
            <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 8 }}>
                <View style={{ flex: 0.2 }}>

                </View>
                <ClearView style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '500' }}>{numLegs} Leg{numLegs > 1 ? 's' : '' }</Text>
                </ClearView>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2 }}>
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
                </ClearView>                                        
            </ClearView>
            {bet.legs.map((leg, index) => (
                <Leg key={index} leg={leg} currentBet={bet} onRemove={onRemove}/>
            ))}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    betContainer: {
        borderTopWidth: 2,
        borderBottomWidth: 1,
        paddingTop: 8,
    },
});