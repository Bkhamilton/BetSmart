import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import LegComponent from './LegComponent';

export default function BetComponent({ bet }) {
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
                    <LegComponent key={index} leg={leg} />
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
});