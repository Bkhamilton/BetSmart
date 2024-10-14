import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext'; 
import { View } from '@/components/Themed';
import MainButtons from '@/components/PlaceBet/SelectGame/MainButtons';
import GameList from '@/components/PlaceBet/SelectGame/GameList/GameList';
import SportSlider from '@/components/PlaceBet/SelectGame/SportSlider';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import DatePicker from '@/components/PlaceBet/SelectGame/DatePicker';
import SelectGameHeader from '@/components/PlaceBet/SelectGame/SelectGameHeader';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import BetSlipModal from '@/components/Modals/BetSlipModal/BetSlipModal';
import SelectLeague from '@/components/Modals/SelectLeague';
import useHookNewBet from '@/hooks/useHookNewBet';
import useHookSelectGame from '@/hooks/useHookSelectGame';

export default function SelectGameScreen() {

  const { league, betSlip } = useContext(BetContext);
  const { leagues } = useContext(DBContext);

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
    date,
    header,
    selectLeagueModal,
    leagueSelected,
    allSportsData,
    openSelectLeagueModal,
    closeSelectLeagueModal,
    updateDate,
    selectLeague,
  } = useHookSelectGame();

  const curLeagueData = allSportsData?.find(sportData => sportData.sport === league?.leagueName);
  const curLeagueGames = curLeagueData ? curLeagueData.data : [];

  return (
    <>
      <SelectGameHeader
        header={header}
        openChooseBookieModal={openChooseBookieModal}
      />
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
      {
        leagues.length > 1 && (
          <SelectLeague
            visible={selectLeagueModal}
            close={closeSelectLeagueModal}
            selectLeague={selectLeague}
          />
        )
      }
      <View style={styles.mainContainer}>
        {
          leagues.length > 1 && (
            leagueSelected ? (
              <>
                <View style={{ paddingTop: 10, paddingBottom: 6 }}>
                  <SportSlider
                    selectLeague={selectLeague}
                  />
                  <DatePicker
                    date={date}
                    updateDate={updateDate}
                  />
                </View>
                <GameList
                  games={curLeagueGames.games}
                />
                {
                  betSlip &&
                  <BetSlipBanner
                    onPress={openBetSlipModal}
                  />
                }
              </>
            ) : (
              <View style={styles.buttonsContainer}>
                <MainButtons
                  selectLeague={selectLeague}
                  openModal={openSelectLeagueModal}
                />
                {
                  betSlip &&
                  <BetSlipBanner
                    onPress={openBetSlipModal}
                  />
                }
              </View>
            )
          )
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  mainContainer: {
    flex: 1, 
    alignItems: 'center',
  }
});
