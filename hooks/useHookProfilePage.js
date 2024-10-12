import { useState } from 'react';

const useHookProfilePage = () => {
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