import { useState, useCallback } from 'react';

const useConfirmationState = () => {

    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [doubleConfirmModalVisible, setDoubleConfirmModalVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [doubleConfirmCallback, setDoubleConfirmCallback] = useState(null);

    const openConfirmationModal = () => setConfirmationModalVisible(true);
    const closeConfirmationModal = () => setConfirmationModalVisible(false);
    const openDoubleConfirmModal = () => setDoubleConfirmModalVisible(true);
    const closeDoubleConfirmModal = () => setDoubleConfirmModalVisible(false);

    function setMessage(message) {
        setConfirmMessage(message);
    }

    function handleConfirmCallback(callback) {
        setConfirmCallback(callback);
    }

    function handleDoubleConfirmCallback(callback) {
        setDoubleConfirmCallback(callback);
    }

    const handleConfirm = (response) => {
        if (confirmCallback) {
          confirmCallback(response);
        }
    };

    const handleDoubleConfirm = (response) => {
        if (doubleConfirmCallback) {
            doubleConfirmCallback(response);
        }
    };

    const onHandleConfirm = (response) => {
        handleConfirm(response);
        closeConfirmationModal();
    };

    const onHandleDoubleConfirm = (response) => {
        handleDoubleConfirm(response);
        closeDoubleConfirmModal();
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

    const confirmDoubleAction = useCallback(async () => {
        openDoubleConfirmModal();

        const response = await new Promise((resolve) => {
            handleDoubleConfirmCallback(() => resolve);
        });

        closeDoubleConfirmModal();
        return response;
    }, [openDoubleConfirmModal, handleDoubleConfirmCallback, closeDoubleConfirmModal]);

    const handleConfirmation = async (message, closeModal, handleResponse, target, refresh) => {
        closeModal();
        const response = await confirmAction(message);

        if (response) {
            if (Array.isArray(target)) {
                handleResponse(...target);
            } else {
                handleResponse(target);
            }
            if (refresh) {
                refresh();
            }
        }
    };

    const handleConfirmNoModal = async (message, handleResponse, target) => {
        const response = await confirmAction(message);

        if (response) {
            if (Array.isArray(target)) {
                handleResponse(...target);
            } else {
                handleResponse(target);
            }
        }
    }

    const handleDoubleConfirmation = async (message, handleResponse, target) => {
        const response = await confirmAction(message);

        if (response) {
            const confirmResponse = await confirmDoubleAction();
            if (confirmResponse) {
                handleResponse(target);
            }
        }
    }

    return {
        confirmationModalVisible,
        doubleConfirmModalVisible,
        setConfirmationModalVisible,
        setDoubleConfirmModalVisible,
        openConfirmationModal,
        closeConfirmationModal,
        openDoubleConfirmModal,
        closeDoubleConfirmModal,
        confirmMessage, setMessage,
        confirmCallback, handleConfirmCallback,
        doubleConfirmCallback, handleDoubleConfirmCallback,
        handleConfirm,
        onHandleConfirm,
        onHandleDoubleConfirm,
        startConfirmation,
        confirmAction,
        confirmDoubleAction,
        handleConfirmation,
        handleConfirmNoModal,
        handleDoubleConfirmation,
    };
};

export default useConfirmationState;