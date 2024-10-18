import React from 'react';
import { StyleSheet } from 'react-native';
import { ClearView } from '@/components/Themed';
import AltLine from './LeaguePropTypes/AltLine';
import MainLine from './LeaguePropTypes/MainLine';
import GameLines from './LeaguePropTypes/GameLines';
import FirstBasket from './LeaguePropTypes/FirstBasket';
import PlayerSpecial from './LeaguePropTypes/PlayerSpecial';
import TeamSpecial from './LeaguePropTypes/TeamSpecial';
import AltSpread from './LeaguePropTypes/AltSpread';
import AltTotal from './LeaguePropTypes/AltTotal';
import AltPlayerLine from './LeaguePropTypes/AltPlayerLine';
import StatLeaders from './LeaguePropTypes/StatLeaders';
import HalfLines from './LeaguePropTypes/HalfLines';
import QuarterLines from './LeaguePropTypes/QuarterLines';
import TeamProps from './LeaguePropTypes/TeamProps';
import AltGameProps from './LeaguePropTypes/AltGameProps';
import FirstToX from './LeaguePropTypes/FirstToX';
import GameProps from './LeaguePropTypes/GameProps';
import FirstToScore from './LeaguePropTypes/FirstToScore';
import HitProps from './LeaguePropTypes/HitProps';
import HRProps from './LeaguePropTypes/HRProps';
import RBIProps from './LeaguePropTypes/RBIProps';
import RunProps from './LeaguePropTypes/RunProps';
import PitcherProps from './LeaguePropTypes/PitcherProps';
import StrikeoutProps from './LeaguePropTypes/StrikeoutProps';
import FirstXInnings from './LeaguePropTypes/FirstXInnings';
import InningsLines from './LeaguePropTypes/InningsLines';
import FirstGoal from './LeaguePropTypes/FirstGoal';
import GoalScorer from './LeaguePropTypes/GoalScorer';
import PlayerProps from './LeaguePropTypes/PlayerProps';
import GoalieProps from './LeaguePropTypes/GoalieProps';
import FirstXPeriods from './LeaguePropTypes/FirstXPeriods';
import PeriodLines from './LeaguePropTypes/PeriodLines';
import TDScorer from './LeaguePropTypes/TDScorer';
import PassProps from './LeaguePropTypes/PassProps';
import RushProps from './LeaguePropTypes/RushProps';
import RecieveProps from './LeaguePropTypes/RecieveProps';
import DefenseProps from './LeaguePropTypes/DefenseProps';
import SpecTeamProps from './LeaguePropTypes/SpecTeamProps';

export default function LeaguePropInfo({ leaguePropInfo }) {

    const componentMapping = {
        'alt-line': AltLine,
        'main-line': MainLine,
        'game-lines': GameLines,
        'first-basket': FirstBasket,
        'player-special': PlayerSpecial,
        'team-special': TeamSpecial,
        'alt-spread': AltSpread,
        'alt-total': AltTotal,
        'alt-player-line': AltPlayerLine,
        'stat-leaders': StatLeaders,
        'half-lines': HalfLines,
        'quarter-lines': QuarterLines,
        'team-props': TeamProps,
        'alt-game-props': AltGameProps,
        'first-to-x': FirstToX,
        'game-props': GameProps,
        'first-to-score': FirstToScore,
        'hit-props': HitProps,
        'hr-props': HRProps,
        'rbi-props': RBIProps,
        'run-props': RunProps,
        'pitcher-props': PitcherProps,
        'strikeout-props': StrikeoutProps,
        'first-x-innings': FirstXInnings,
        'innings-lines': InningsLines,
        'first-goal': FirstGoal,
        'goal-scorer': GoalScorer,
        'player-props': PlayerProps,
        'goalie-props': GoalieProps,
        'first-x-periods': FirstXPeriods,
        'period-lines': PeriodLines,
        'td-scorer': TDScorer,
        'pass-props': PassProps,
        'rush-props': RushProps,
        'receiving-props': RecieveProps,
        'defense-props': DefenseProps,
        'special-teams-props': SpecTeamProps,
    }

    return (
        <>
            {leaguePropInfo.map((info, index) => {
                const Component = componentMapping[info.propValue];
                return (
                    <ClearView key={index} style={styles.container}>
                        <Component info={info}/>
                    </ClearView>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});