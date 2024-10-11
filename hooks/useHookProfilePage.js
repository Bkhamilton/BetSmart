import { useState, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';

const useHookProfilePage = () => {

    const { bookies } = useContext(DBContext);
    const { user, userBalance, setUserBalance } = useContext(UserContext);

    const [addBookieModalVisible, setAddBookieModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const openAddBookieModal = () => {
        setAddBookieModalVisible(true);
    };

    const closeAddBookieModal = () => {
        setAddBookieModalVisible(false);
    }

    const openConfirmMessageModal = () => {
        setConfirmModalVisible(true);
    };

    const closeConfirmMessageModal = () => {
        setConfirmModalVisible(false);
    }

    return {
        addBookieModalVisible,
        confirmModalVisible,
        openAddBookieModal,
        closeAddBookieModal,
        openConfirmMessageModal,
        closeConfirmMessageModal,
    };
};

export default useHookProfilePage;