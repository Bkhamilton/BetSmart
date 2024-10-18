import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import Leg from './Leg';

export default function Bet({ bet, resolveLeg, legIndex }) {
    return (
        <ClearView>
            <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{bet.league}</Text>
                <Text>{bet.odds}</Text>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});