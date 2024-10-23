import AltLine from '../components/PlaceBet/BetDetails/LeaguePropTypes/AltLine';
import MainLine from '../components/PlaceBet/BetDetails/LeaguePropTypes/MainLine';
import GameLines from '../components/PlaceBet/BetDetails/LeaguePropTypes/GameLines';
import FirstBasket from '../components/PlaceBet/BetDetails/LeaguePropTypes/FirstBasket';
import PlayerSpecial from '../components/PlaceBet/BetDetails/LeaguePropTypes/PlayerSpecial';
import TeamSpecial from '../components/PlaceBet/BetDetails/LeaguePropTypes/TeamSpecial';
import AltSpread from '../components/PlaceBet/BetDetails/LeaguePropTypes/AltSpread';
import AltTotal from '../components/PlaceBet/BetDetails/LeaguePropTypes/AltTotal';
import AltPlayerLine from '../components/PlaceBet/BetDetails/LeaguePropTypes/AltPlayerLine';
import StatLeaders from '../components/PlaceBet/BetDetails/LeaguePropTypes/StatLeaders';
import HalfLines from '../components/PlaceBet/BetDetails/LeaguePropTypes/HalfLines';
import QuarterLines from '../components/PlaceBet/BetDetails/LeaguePropTypes/QuarterLines';
import TeamProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/TeamProps';
import AltGameProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/AltGameProps';
import FirstToX from '../components/PlaceBet/BetDetails/LeaguePropTypes/FirstToX';
import GameProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/GameProps';
import FirstToScore from '../components/PlaceBet/BetDetails/LeaguePropTypes/FirstToScore';
import HitProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/HitProps';
import HRProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/HRProps';
import RBIProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/RBIProps';
import RunProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/RunProps';
import PitcherProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/PitcherProps';
import StrikeoutProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/StrikeoutProps';
import FirstXInnings from '../components/PlaceBet/BetDetails/LeaguePropTypes/FirstXInnings';
import InningsLines from '../components/PlaceBet/BetDetails/LeaguePropTypes/InningsLines';
import FirstGoal from '../components/PlaceBet/BetDetails/LeaguePropTypes/FirstGoal';
import GoalScorer from '../components/PlaceBet/BetDetails/LeaguePropTypes/GoalScorer';
import PlayerProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/PlayerProps';
import GoalieProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/GoalieProps';
import FirstXPeriods from '../components/PlaceBet/BetDetails/LeaguePropTypes/FirstXPeriods';
import PeriodLines from '../components/PlaceBet/BetDetails/LeaguePropTypes/PeriodLines';
import TDScorer from '../components/PlaceBet/BetDetails/LeaguePropTypes/TDScorer';
import PassProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/PassProps';
import RushProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/RushProps';
import RecieveProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/RecieveProps';
import DefenseProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/DefenseProps';
import SpecTeamProps from '../components/PlaceBet/BetDetails/LeaguePropTypes/SpecTeamProps';


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
    'recieve-props': RecieveProps,
    'defense-props': DefenseProps,
    'spec-team-props': SpecTeamProps,
};

export default componentMapping;