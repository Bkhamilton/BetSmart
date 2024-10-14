import { useState } from 'react';

const useHookHome = () => {

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [chooseBookieModalVisible, setChooseBookieModalVisible] = useState(false);

  const [confirmedBetSlip, setConfirmedBetSlip] = useState({});

  const [betSlips, setBetSlips] = useState([]);

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

  return {
    loginModalVisible, setLoginModalVisible,
    signUpModalVisible, setSignUpModalVisible,
    confirmModalVisible, setConfirmModalVisible,
    chooseBookieModalVisible, setChooseBookieModalVisible,
    confirmedBetSlip, setConfirmedBetSlip,
    betSlips, setBetSlips,
    openChooseBookieModal,
    closeChooseBookieModal,
    openSignUpModal,
    closeSignUpModal,
    openLoginModal,
    closeLoginModal,
    openConfirmModal,
    closeConfirmModal,
  };
};

export default useHookHome;