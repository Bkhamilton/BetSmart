import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { retrieveBig3Markets } from '@/api/the-odds/markets';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';

export default function GameLines() {

    const [marketProps, setMarketProps] = useState([]);

    const { league, currentGame, selectProp } = useContext(BetContext);

    const { gameId, homeTeamAbv, awayTeamAbv, homeTeamName, awayTeamName } = currentGame;

    const { iconColor, grayBorder, grayBackground } = useTheme();

    const db = useSQLiteContext();

    const fetchMarketProps = async () => {
        retrieveBig3Markets(db, gameId).then((data) => {
            setMarketProps(data);
        });
    };

    useEffect(() => {
        fetchMarketProps();
    }, []);

    function BettingLine({ type, target, stat, value, overUnder, odds, bookieId }) {

        const getValue = (value) => {
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
                onPress={() => selectProp({ game: currentGame, type, target, stat, value, overUnder, odds, bookieId })}
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

    function DisplayMarketLines({ marketProps, marketType }) {
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
                    />
                    <BettingLine
                        type="Main"
                        target={homeTeamAbv}
                        stat="moneyline" 
                        value={homeTeamAbv} 
                        odds="N/A"
                    />
                </View>
            );
        }
    
        // Function that takes an array of market data and returns the object with the "Best Odds" meaning the odds closest to -100 or +100
        const getBestOdds = (marketData) => {
            let bestOdds = marketData[0];
            let bestOddsDiff = Math.min(Math.abs(100 - marketData[0].odds), Math.abs(-100 - marketData[0].odds));
            
            marketData.forEach((line) => {
                const diff = Math.min(Math.abs(100 - line.odds), Math.abs(-100 - line.odds));
                if (diff < bestOddsDiff) {
                    bestOdds = line;
                    bestOddsDiff = diff;
                }
            });
            
            return bestOdds;
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
                {displayData.reverse().map((line) => (
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

    return (
        <View style={styles.container}>
            <DisplayMarketLines marketProps={marketProps} marketType="moneyline" />
            <DisplayMarketLines marketProps={marketProps} marketType="spread" />
            <DisplayMarketLines marketProps={marketProps} marketType="totals" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'transparent', 
        paddingTop: 4
    },
    propContainer: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
});