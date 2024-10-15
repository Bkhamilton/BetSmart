import { useState, useCallback } from 'react';

const useConfirmationState = () => {

    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState(null);

    function openConfirmationModal() {
        setConfirmationModalVisible(true);
    }

    function closeConfirmationModal() {
        setConfirmationModalVisible(false);
    }

    function setMessage(message) {
        setConfirmMessage(message);
    }

    function handleConfirmCallback(callback) {
        setConfirmCallback(callback);
    }

    const handleConfirm = (response) => {
        if (confirmCallback) {
          confirmCallback(response);
        }
    };

    const onHandleConfirm = (response) => {
        handleConfirm(response);
        closeConfirmationModal();
    };

    const startConfirmation = async (message) => {
        setMessage(message);
        openConfirmationModal();
    };

    const confirmAction = useCallback(async (message) => {
        setMessage(message);
        openConfirmationModal();
    
        const response = await new Promise((resolve) => {
          handleConfirmCallback(() => resolve);
        });
    
        closeConfirmationModal();
        return response;
    }, [openConfirmationModal, handleConfirmCallback, closeConfirmationModal]);


    return {
        confirmationModalVisible,
        setConfirmationModalVisible,
        openConfirmationModal,
        closeConfirmationModal,
        confirmMessage, setMessage,
        confirmCallback, handleConfirmCallback,
        handleConfirm,
        onHandleConfirm,
        startConfirmation,
        confirmAction,
    };
};

export default useConfirmationState;