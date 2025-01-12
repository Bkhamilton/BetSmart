import React, { useContext } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { ScrollView } from '@/components/Themed';
import IntroInfo from '@/components/PlaceBet/BetDetails/IntroInfo';
import LeaguePropSlider from '@/components/PlaceBet/BetDetails/LeaguePropSlider';
import LeaguePropInfo from '@/components/PlaceBet/BetDetails/LeaguePropInfo';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import useHookNewBet from '@/hooks/useHookNewBet';
import useHookBetDetails from '@/hooks/useHookBetDetails';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import BetSlipModal from '@/components/Modals/BetSlipModal/BetSlipModal';
import ChoosePlayer from '@/components/Modals/ChoosePlayer';
import BetDetailsHeader from '@/components/PlaceBet/BetDetails/BetDetailsHeader';

export default function BetDetailsScreen() {
    
    const { league, betSlip } = useContext(BetContext);

    const { 
        betSlipModalVisible,
        chooseBookieModalVisible,
        openBetSlipModal,
        closeBetSlipModal,
        openChooseBookieModal,
        closeChooseBookieModal, 
        selectBookie,
        removeProp,
        removeBetSlip,
        confirmBet,
    } = useHookNewBet();

    const {
        leagueProps,
        leaguePropInfo,
        curLeagueProp,
        selectLeagueProp,
    } = useHookBetDetails();

    return (
        <>
            <ChooseBookie
                visible={chooseBookieModalVisible}
                close={closeChooseBookieModal}
                selectBookie={selectBookie}
            />
            <ChoosePlayer/>
            {
                betSlip && (
                <BetSlipModal
                    visible={betSlipModalVisible}
                    close={closeBetSlipModal}
                    removeProp={removeProp}
                    removeBetSlip={removeBetSlip}
                    confirm={confirmBet}
                />
                )
            }
            <BetDetailsHeader
                league={league}
                openChooseBookieModal={openChooseBookieModal}
            />
            <ScrollView>
                <IntroInfo/>
                {
                    leagueProps.length > 0 &&
                    <>
                        <LeaguePropSlider 
                        leagueProps={leagueProps}
                        selectLeagueProp={selectLeagueProp}
                        curLeagueProp={curLeagueProp}
                        />
                        <LeaguePropInfo 
                        leagueProp={curLeagueProp}
                        leaguePropInfo={leaguePropInfo}
                        />
                    </>
                }
            </ScrollView>
            {
                betSlip &&
                <BetSlipBanner
                onPress={openBetSlipModal}
                />
            }
        </>
    );
}