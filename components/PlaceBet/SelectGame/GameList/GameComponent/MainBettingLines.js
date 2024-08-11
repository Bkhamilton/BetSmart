import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

export default function MainBettingLines({ game, marketProps }) {

    const { gameId, homeTeamAbv, awayTeamAbv, homeTeamName, awayTeamName } = game;

    const { selectProp } = useContext(BetContext);

    const { grayBorder } = useTheme();

    function BettingLine({ type, target, stat, value, overUnder, odds }) {

        const getOdds = (odds) => {
            if (odds > 0) {
                return '+' + odds;
            } else {
                return odds.toString();
            }
        }

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
                onPress={() => selectProp({ game, type, target, stat, value, overUnder, odds })}
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
      
        // Group data by bookieId
        const groupedByBookie = marketData.reduce((acc, item) => {
          acc[item.bookieId] = [...(acc[item.bookieId] || []), item];
          return acc;
        }, {});
      
        // Select data for display
        let displayData = [];
        const bookieIds = Object.keys(groupedByBookie);
        if (bookieIds.length === 1) {
            // Only one bookie, use all data
            displayData = groupedByBookie[bookieIds[0]];
        } else {
            // Multiple bookies, select the one with more data
            let maxCount = 0;
            let maxBookieId = null;
            for (let bookieId of bookieIds) {
                const count = groupedByBookie[bookieId].length;
                if (count > maxCount) {
                    maxCount = count;
                    maxBookieId = bookieId;
                }
            }
            displayData = groupedByBookie[maxBookieId];
        }

        // Handle total_over_under marketType
        if (marketType === 'total_over_under') {
            // Sort the data by value
            displayData.sort((a, b) => a.value - b.value);

            // Find the median values
            const midIndex = Math.floor(displayData.length / 2);
            const medianOver = displayData[midIndex];
            const medianUnder = displayData[midIndex - 1] || displayData[midIndex];

            // Set displayData to only include the median over and under values
            displayData = [medianOver, medianUnder];
        }
      
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
              />
            ))}
          </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <DisplayMarketLines marketProps={marketProps} marketType="moneyline" />
                <DisplayMarketLines marketProps={marketProps} marketType="spread" />
                <DisplayMarketLines marketProps={marketProps} marketType="total_over_under" />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent', 
    paddingTop: 2
  },
  propContainer: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});