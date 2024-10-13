import { useState } from 'react';

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

    return {
        confirmationModalVisible,
        openConfirmationModal,
        closeConfirmationModal,
        confirmMessage, setMessage,
        confirmCallback, handleConfirmCallback,
        handleConfirm,
    };
};

export default useConfirmationState;