import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import AltLine from './LeaguePropTypes/AltLine';
import MainLine from './LeaguePropTypes/MainLine';
import Colors from '@/constants/Colors';

export default function LeaguePropInfo({ leaguePropInfo }) {

    const componentMapping = {
        'alt-line': <AltLine />,
        'main-line': <MainLine />,
        'game-lines': <Text>Game Lines</Text>,
        'first-basket': <Text>First Basket</Text>,
        'player-special': <Text>Player Special</Text>,
        'team-special': <Text>Team Special</Text>,
        'alt-spread': <Text>Alternate Spread</Text>,
        'alt-total': <Text>Alternate Total</Text>,
        'alt-player-line': <Text>Alternate Player Line</Text>,
        'first-to-reach': <Text>First to Reach</Text>,
        'stat-leaders': <Text>Stat Leaders</Text>,
        'half-lines': <Text>Half Lines</Text>,
        'quarter-lines': <Text>Quarter Lines</Text>,
        'team-props': <Text>Team Props</Text>,
        'alt-game-props': <Text>Alternate Game Props</Text>,
        'first-to-x': <Text>First to X</Text>,
        'game-props': <Text>Game Props</Text>,
        'first-to-score': <Text>First to Score</Text>,
        'hit-props': <Text>Hit Props</Text>,
        'hr-props': <Text>HR Props</Text>,
        'rbi-props': <Text>RBI Props</Text>,
        'run-props': <Text>Run Props</Text>,
        'total-bases': <Text>Total Bases</Text>,
        'pitcher-props': <Text>Pitcher Props</Text>,
        'strikeout-props': <Text>Strikeout Props</Text>,
        'first-x-innings': <Text>First X Innings</Text>,
        'innings-lines': <Text>Innings Lines</Text>,
        'first-goal': <Text>First Goal</Text>,
        'goal-scorer': <Text>Goal Scorer</Text>,
        'player-props': <Text>Player Props</Text>,
        'goalie-props': <Text>Goalie Props</Text>,
        'first-x-periods': <Text>First X Periods</Text>,
        'period-lines': <Text>Period Lines</Text>,
    }

    return (
        <>
            {leaguePropInfo.map((info, index) => {
    
                return (
                    <View key={index} style={{ borderWidth: 1, width: '100%' }}>
                        {componentMapping[info.propValue]}
                    </View>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
});