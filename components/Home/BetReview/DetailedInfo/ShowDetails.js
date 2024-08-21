import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

export default function ShowDetails({ bet }) {

    const { iconColor, grayBackground, grayBorder, mainGreen } = useTheme();

    const BetLegsDetail = ({ legs }) => {

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
            return `${leg.betTarget} ${leg.marketType}`;
        }
        };
    
        return (
            <View style={{ backgroundColor: 'transparent' }}>
                {legs.map((leg, index) => (
                    <View key={index} style={{ backgroundColor: 'transparent' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
                            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1 }}/>
                            <View style={{ backgroundColor: 'transparent', paddingLeft: 4, }}>
                                <Text style={{ fontWeight: '600' }}>{leg.betTarget}</Text>
                                <Text>{displayLegInfo(leg)}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        );
    }; 
      
    const BetListDetail = ({ bet }) => {
        return (
        <View style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <Text>{bet.sport}</Text>
                <Text>{bet.odds}</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{bet.homeTeamAbv} vs {bet.awayTeamAbv}</Text>
            </View>
            <BetLegsDetail legs={bet.legs} />
        </View>
        );
    }; 

    return (
        <View style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <Text style={styles.betText}>{bet.date}</Text>
                <Text style={styles.betText}>{bet.odds}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: 'transparent' }}>
                    <Text style={styles.betText}>Bet</Text>
                    <Text style={styles.betText}>${bet.betAmount.toFixed(2)}</Text>
                </View>
                <View style={{ backgroundColor: 'transparent' }}>
                    <Text style={styles.betText}>To Win</Text>
                    <Text style={styles.betText}>${bet.winnings.toFixed(2)}</Text>
                </View>
            </View>
            {bet.bets.map((betDetail, index) => (
                <BetListDetail key={index} bet={betDetail} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    betContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
    },
    betText: {
        fontSize: 16,
        fontWeight: '600',
    },
});