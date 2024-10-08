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
  const [chooseBookieModalVisible, setChooseBookieModalVisible] = useState(false);
  const [addBookieModalVisible, setAddBookieModalVisible] = useState(false);
  const [confirmMessageModalVisible, setConfirmMessageModalVisible] = useState(false);

  const [transactionTitle, setTransactionTitle] = useState('Deposit');
  const [transactionBookie, setTransactionBookie] = useState('DraftKings');
  const [transactionBookieId, setTransactionBookieId] = useState(1);

  const [confirmMessage, setConfirmMessage] = useState('');

  const [userTransactions, setUserTransactions] = useState([]);

  const [confirmedBetSlip, setConfirmedBetSlip] = useState({});

  const [betSlips, setBetSlips] = useState([]);

  function openConfirmMessageModal() {
    setConfirmMessageModalVisible(true);
  }

  function closeConfirmMessageModal() {
    setConfirmMessageModalVisible(false);
  }

  function openAddBookieModal() {
    setAddBookieModalVisible(true);
  }

  function closeAddBookieModal() {
    setAddBookieModalVisible(false);
  }

  function openChooseBookieModal() {
    setChooseBookieModalVisible(true);
  }

  function closeChooseBookieModal() {
    setChooseBookieModalVisible(false);
  }

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
    chooseBookieModalVisible, setChooseBookieModalVisible,
    addBookieModalVisible, setAddBookieModalVisible,
    confirmMessageModalVisible, setConfirmMessageModalVisible,
    transactionTitle, setTransactionTitle,
    transactionBookie, setTransactionBookie,
    transactionBookieId, setTransactionBookieId,
    confirmMessage, setConfirmMessage,
    userTransactions, setUserTransactions,
    confirmedBetSlip, setConfirmedBetSlip,
    betSlips, setBetSlips,
    openConfirmMessageModal,
    closeConfirmMessageModal,
    openAddBookieModal,
    closeAddBookieModal,
    openChooseBookieModal,
    closeChooseBookieModal,
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