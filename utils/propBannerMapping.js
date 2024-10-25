import MainPlayer from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MainPlayer";
import AltPlayer from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/AltPlayer";
import ToAchieve from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/ToAchieve";
import ToRecord from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/ToRecord";
import GenericProp from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/GenericProp";
import MainDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MainDisplay";
import AltDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/AltDisplay";

const propBannerMapping = {
    Player: MainPlayer,
    'Player Alt': AltPlayer,
    Alt: AltDisplay,
    Alternate: AltDisplay,
    Main: MainDisplay,
    'To Achieve': ToAchieve,
    Generic: GenericProp,
    'To Record': ToRecord,
};

export default propBannerMapping;