import React, { useContext } from 'react';
import { Link } from 'expo-router';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { ScrollView, View, Text } from '@/components/Themed';
import IntroInfo from '@/components/PlaceBet/BetDetails/IntroInfo';
import LeaguePropSlider from '@/components/PlaceBet/BetDetails/LeaguePropSlider';
import LeaguePropInfo from '@/components/PlaceBet/BetDetails/LeaguePropInfo';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import useHookNewBet from '@/hooks/useHookNewBet';
import useHookBetDetails from '@/hooks/useHookBetDetails';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import BetSlipModal from '@/components/Modals/BetSlipModal/BetSlipModal';
import BetDetailsHeader from '@/components/PlaceBet/BetDetails/BetDetailsHeader';

export default function BetDetailsScreen() {
    const { league, currentGame } = useContext(BetContext);
    if (!league || !currentGame) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                <Text>Select a game before viewing bet details.</Text>
                <Link href="/(tabs)/newBet/selectGame">Choose a game</Link>
            </View>
        );
    }
    return <BetDetailsContent />;
}

function BetDetailsContent() {
    
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
                extra={null}
            />
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