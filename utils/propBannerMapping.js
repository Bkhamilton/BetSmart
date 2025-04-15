import MainPlayer from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MainPlayer";
import AltPlayer from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/AltPlayer";
import ToRecord from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/ToRecord";
import GenericProp from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/GenericProp";
import MainDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MainDisplay";
import AltDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/AltDisplay";
import TotalDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/TotalDisplay";
import SpreadDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/SpreadDisplay";
import MoneylineDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MoneylineDisplay";
import ToRecordValue from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/ToRecordValue";

const propBannerMapping = {
    Player: MainPlayer,
    'Player Alt': AltPlayer,
    Alt: AltDisplay,
    Alternate: AltDisplay,
    Main: MainDisplay,
    Generic: GenericProp,
    'To Record': ToRecord,
    'To Record Value': ToRecordValue,
    'Total': TotalDisplay,
    'Spread': SpreadDisplay,
    'Moneyline': MoneylineDisplay,
};

export default propBannerMapping;