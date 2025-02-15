import MainPlayer from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MainPlayer";
import AltPlayer from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/AltPlayer";
import ToRecord from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/ToRecord";
import GenericProp from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/GenericProp";
import MainDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/MainDisplay";
import AltDisplay from "../components/PlaceBet/BetDetails/LeaguePropTypes/PropBanner/PropTypes/AltDisplay";
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
};

export default propBannerMapping;