import { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { BetContext } from '@/contexts/BetContext/BetContext';

const useRouting = () => {

    const { setCurrentGame } = useContext(BetContext);

    const router = useRouter();

    const handleProfilePage = () => {
        router.replace('profile/profilePage');
    };

    const handleBetHistory = () => {
      router.replace('profile/betHistory');
    };

    const handleSettings = () => {
        router.replace('profile/settings');
    };

    const handleEditProfile = () => {
        router.replace('profile/editProfile');
    };

    const handleTransactions = () => {
        router.replace('profile/transactionHistory');
    }
    
    const handleSelectGame = ({ game }) => {
        setCurrentGame(game);
        router.navigate('newBet/betDetails');
    };

    const handleCloseBetDetails = () => {
        router.navigate('newBet/selectGame');
    };

    return {
        handleProfilePage,
        handleBetHistory,
        handleSettings,
        handleEditProfile,
        handleTransactions,
        handleSelectGame,
        handleCloseBetDetails,
    };
};

export default useRouting;