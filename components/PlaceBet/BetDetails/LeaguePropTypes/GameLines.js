import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { retrieveMarketsDB } from '@/api/prop-odds/markets';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';

export default function GameLines() {

    const [marketProps, setMarketProps] = useState([]);

    const { league, currentGame, selectProp } = useContext(BetContext);

    const { gameId, homeTeamAbv, awayTeamAbv, homeTeamName, awayTeamName } = currentGame;

    const { iconColor, grayBorder, grayBackground } = useTheme();

    const db = useSQLiteContext();

    const fetchMarketProps = async () => {
        retrieveMarketsDB(db, gameId, ['spread', 'moneyline', 'total_over_under']).then((data) => {
            setMarketProps(data);
        });
    };

    useEffect(() => {
        fetchMarketProps();
    }, []);

    function BettingLine({ type, target, stat, value, overUnder, odds }) {

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
                onPress={() => selectProp({ game: currentGame, type, target, stat, value, overUnder, odds })}
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
      
        if (!marketData) {
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
        <View style={styles.container}>
            <DisplayMarketLines marketProps={marketProps} marketType="moneyline" />
            <DisplayMarketLines marketProps={marketProps} marketType="spread" />
            <DisplayMarketLines marketProps={marketProps} marketType="total_over_under" />
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