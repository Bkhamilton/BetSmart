import { useState, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';

const useModalHome = () => {

  const { bookies } = useContext(DBContext);
  const { userBalance, setUserBalance } = useContext(UserContext);

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [transactionTitle, setTransactionTitle] = useState('Deposit');
  const [transactionBookie, setTransactionBookie] = useState('DraftKings');
  const [transactionBookieId, setTransactionBookieId] = useState(1);

  const [confirmedBetSlip, setConfirmedBetSlip] = useState({});

  const [userTransactions, setUserTransactions] = useState([]);
  const [betSlips, setBetSlips] = useState([]);

  function openSignUpModal() {
    setSignUpModalVisible(true);
  }
  function closeSignUpModal() {
    setSignUpModalVisible(false);
  }

  function openLoginModal() {
    setLoginModalVisible(true);
  }
  function closeLoginModal() {
    setLoginModalVisible(false);
  }
  function openConfirmModal(betSlip) {
    setConfirmedBetSlip(betSlip);
    setConfirmModalVisible(true);
  }
  function closeConfirmModal() {
    setConfirmModalVisible(false);
  }

  function updateTransactionInfo(title, balance, bookie) {
    setTransactionTitle(title);
    setTransactionBookie(bookie);
    const curBookie = bookies.find(item => item.name === bookie);
    setTransactionBookieId(curBookie.id);
    setUserBalance(balance);
  }

  function openTransactionModal(type, balance, bookie) {
    updateTransactionInfo(type, balance, bookie);
    setTransactionModalVisible(true);
  }
  function closeTransactionModal() {
    setTransactionModalVisible(false);
  }

  return {
    loginModalVisible, setLoginModalVisible,
    signUpModalVisible, setSignUpModalVisible,
    transactionModalVisible, setTransactionModalVisible,
    confirmModalVisible, setConfirmModalVisible,
    transactionTitle, setTransactionTitle,
    transactionBookie, setTransactionBookie,
    transactionBookieId, setTransactionBookieId,
    confirmedBetSlip, setConfirmedBetSlip,
    userTransactions, setUserTransactions,
    betSlips, setBetSlips,
    openSignUpModal,
    closeSignUpModal,
    openLoginModal,
    closeLoginModal,
    openConfirmModal,
    closeConfirmModal,
    openTransactionModal,
    closeTransactionModal,
  };
};

export default useModalHome;