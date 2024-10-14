import { useState, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { removeLeg, updateBetSlipAmounts, updateBetSlipBookie } from '@/contexts/BetContext/betSlipHelpers';
import { useSQLiteContext } from 'expo-sqlite';

const useHookNewBet = () => {

    const db = useSQLiteContext();

    const { setBookie, setBookieId, betSlip, setBetSlip, confirmBetSlip } = useContext(BetContext);

    const [betSlipModalVisible, setBetSlipModalVisible] = useState(false);
    const [chooseBookieModalVisible, setChooseBookieModalVisible] = useState(false);

    const [totalLegs, setTotalLegs] = useState(0);

    function openBetSlipModal() {
        setBetSlipModalVisible(true);
    }

    function closeBetSlipModal() {
        setBetSlipModalVisible(false);
    }

    function openChooseBookieModal() {
        setChooseBookieModalVisible(true);
    }

    function closeChooseBookieModal() {
        setChooseBookieModalVisible(false);
    }

    const selectBookie = (bookie) => {
        closeChooseBookieModal();
        setBookie(bookie.bookieName);
        setBookieId(bookie.bookieId);
    }

    const removeProp = (bet, leg) => {
        const newBetSlip = removeLeg(betSlip, bet, leg);
        if (!newBetSlip) {
          closeBetSlipModal();
          setBetSlip(null);
        }
        setTotalLegs(betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0);
    }
    
    const removeBetSlip = () => {
        closeBetSlipModal();
        setBetSlip(null);
        setTotalLegs(0);
    }

    const confirmBet = (wager, winnings, bookieId) => {
        updateBetSlipAmounts(betSlip, wager, winnings);
        updateBetSlipBookie(betSlip, bookieId);
    
        closeBetSlipModal();
        confirmBetSlip(db);
    }

    return {
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
    };
};

export default useHookNewBet;