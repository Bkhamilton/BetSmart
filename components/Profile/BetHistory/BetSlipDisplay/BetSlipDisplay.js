import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function BetSlipDisplay({ betSlips, selectedType }) {

    const SingleBetSlipDisplay = ({ betSlip }) => {
        return (
            <View>

            </View>
        );
    }

    const ParlayBetSlipDisplay = ({ betSlip }) => {
        return (
            <View>

            </View>
        );
    }

    const MiniBetSlipDisplay = ({ betSlip }) => {
        return (
            <View>
                <View>
                    <View>
                        <Text>Bookie</Text>
                    </View>
                    <View>
                        <Text>W</Text>
                    </View>
                </View>
                <View>
                    {/* Main Display for Bet Slip */}
                    {/* If betSlip is a single bet Display A */}
                    {/* If betSlip is a parlay bet Display B */}
                </View>
                <View>
                    <Text>Bet: $4.00</Text>
                    <Text>Won: $8.00</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 16 }}>{selectedType} Bets</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
});