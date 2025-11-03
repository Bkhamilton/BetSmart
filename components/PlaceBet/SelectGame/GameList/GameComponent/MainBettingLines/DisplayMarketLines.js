import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { getBetTargetId } from '@/db/bet-general/BetTargets';

import { getBestOdds } from '@/utils/betMarketHelpers';

export default function DisplayMarketLines({ game, marketProps, marketType }) {

    const { gameId, homeTeamAbv, awayTeamAbv, homeTeamName, awayTeamName } = game;

    const { selectProp } = useContext(BetContext);

    const { grayBorder } = useTheme();

    function BettingLine({ type, target, stat, value, overUnder, odds, bookieId }) {

        const exceptions = ["San Francisco 49ers", "Philadelphia 76ers"]

        const getValue = (value) => {

            if (exceptions.includes(value)) {
                const teamName = value.split(' ')[1];
    
                if (homeTeamName.includes(teamName)) {
                    return homeTeamAbv;
                }
    
                if (awayTeamName.includes(teamName)) {
                    return awayTeamAbv;
                }
    
                return value;
            }

            // If value is a number, return it as is
            if (/[0-9]/.test(value)) {
                if (overUnder) {
                    return overUnder.charAt(0) + ' ' + value;
                } else {
                    return value;
                }
            }
            
            // If value is a string, it will be in the form "LOC TeamName". Return TeamName
            const teamName = value.split(' ')[1];

            // if teamName is included in homeTeamName, return homeTeamAbv
            if (homeTeamName.includes(teamName)) {
                return homeTeamAbv;
            }

            // if teamName is included in awayTeamName, return awayTeamAbv
            if (awayTeamName.includes(teamName)) {
                return awayTeamAbv;
            }

            return value;
        }

        return (
            <TouchableOpacity 
                style={[styles.propContainer, { borderColor: grayBorder }]}
                onPress={() => selectProp({ game, type, target, stat, value, overUnder, odds, bookieId })}
            >
                {/[0-9]/.test(value) ? (
                    <>
                        <Text>{getValue(value)}</Text>
                        <Text style={{ fontSize: 8 }}>{odds}</Text>
                    </>
                ) : (
                    <>
                        <Text>{odds}</Text>
                        <Text style={{ fontSize: 8 }}>{getValue(value)}</Text>
                    </>
                )}
            </TouchableOpacity>
        );
    }

    // Find the market data for the specified marketType
    const marketData = marketProps.find(market => market.market === marketType)?.data;
    
    if (!marketData || marketData.length === 0) {
        return (
            <View>
                <BettingLine
                    type="Main"
                    target={awayTeamAbv} 
                    stat="moneyline"
                    value={awayTeamAbv} 
                    odds="N/A"
                    bookieId={1}
                />
                <BettingLine
                    type="Main"
                    target={homeTeamAbv}
                    stat="moneyline" 
                    value={homeTeamAbv} 
                    odds="N/A"
                    bookieId={1}
                />
            </View>
        );
    }

    // Function to fill display data
    const fillDisplayData = (groupedByBookie, marketType) => {
        let displayData = [];
        const bookieIds = Object.keys(groupedByBookie);
        if (bookieIds.length === 1) {
            // Only one bookie, use all data
            displayData = groupedByBookie[bookieIds[0]];
        } else {
            // Multiple bookies, select the first one. LATER, ADD LOGIC TO SELECT SPECIFIC BOOKIE
            displayData = groupedByBookie[bookieIds[0]];
        }

        // Handle moneyline marketType
        if (marketType === 'moneyline') {

            // select the object with the most recent timestamp data for each of the betTargetIds in the displayData (there will only be two)
            displayData = displayData.reduce((acc, item) => {
                const existingItem = acc.find(i => i.betTargetId === item.betTargetId);
                if (!existingItem || item.timestamp > existingItem.timestamp) {
                    acc = acc.filter(i => i.betTargetId !== item.betTargetId);
                    acc.push(item);
                }
                return acc;
            }, []);
        }

        // Handle spread marketType
        if (marketType === 'spread') {
            // Sort the data by value
            displayData.sort((a, b) => a.value - b.value);

            // Find the object with the Best Odds
            const bestOdds = getBestOdds(displayData);

            // The object to be included alongside bestOdds is the one with the inverse value and a different betTargetId
            const inverseValue = -bestOdds.value;
            const inverseLine = displayData.find(item => item.value === inverseValue && item.betTargetId !== bestOdds.betTargetId);

            // Set displayData to only include the bestOdds and the inverseLine
            displayData = [bestOdds, inverseLine].filter(Boolean); // Filter out any undefined values
        }     

        // Handle total_over_under marketType
        if (marketType === 'totals') {
            // Sort the data by value
            displayData.sort((a, b) => a.value - b.value);

            // Find the median value
            const midIndex = Math.floor(displayData.length / 2);
            const medianValue = displayData[midIndex].value;

            // Find the objects with the median value and the appropriate overUnder property
            const medianOver = displayData.find(item => item.value === medianValue && item.overUnder === 'Over');
            const medianUnder = displayData.find(item => item.value === medianValue && item.overUnder === 'Under');

            // Set displayData to only include the median over and under values
            displayData = [medianOver, medianUnder].filter(Boolean); // Filter out any undefined values
        }

        return displayData;
    }
    
    // Group data by bookieId
    const groupedByBookie = marketData.reduce((acc, item) => {
        acc[item.bookieId] = [...(acc[item.bookieId] || []), item];
        return acc;
    }, {});
    
    // Select data for display
    let displayData = fillDisplayData(groupedByBookie, marketType);

    return (
        <View>
            {displayData.map((line) => (
                <BettingLine
                    key={line.id}
                    type={'Main'}
                    target={line.betTargetId} // Assuming you want to use betTargetId as target
                    stat={line.marketType}
                    value={line.value.toString()}
                    overUnder={line.overUnder}
                    odds={line.odds}
                    bookieId={line.bookieId}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    propContainer: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
});