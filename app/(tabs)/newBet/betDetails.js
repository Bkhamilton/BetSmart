import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import IntroInfo from '@/components/PlaceBet/BetDetails/IntroInfo';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import LeaguePropSlider from '@/components/PlaceBet/BetDetails/LeaguePropSlider';
import LeaguePropInfo from '@/components/PlaceBet/BetDetails/LeaguePropInfo';
import useTheme from '@/hooks/useTheme';
import useHookNewBet from '@/hooks/useHookNewBet';
import useHookBetDetails from '@/hooks/useHookBetDetails';
import useRouting from '@/hooks/useRouting';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import BetSlipModal from '@/components/Modals/BetSlipModal/BetSlipModal';

export default function BetDetailsScreen() {
   
  const { league, betSlip } = useContext(BetContext);

  const { handleCloseBetDetails } = useRouting();

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

  const { iconColor, grayBorder } = useTheme();
  
  const GameHeader = () => {
    return (
      <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
        <View style={{ flex: 0.3 }}>
          <TouchableOpacity onPress={handleCloseBetDetails}>
            <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'flex-start', marginLeft: -10, }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{league.leagueName}</Text>
        </View>
        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <BalanceBox openModal={openChooseBookieModal}/>
        </View>
      </View>
    )
  };

  return (
    <>
      <ChooseBookie
        visible={chooseBookieModalVisible}
        close={closeChooseBookieModal}
        selectBookie={selectBookie}
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
      <GameHeader />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 84, 
    paddingLeft: 20,
    paddingRight: 10, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});