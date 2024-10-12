import { useState } from 'react';

const useConfirmationState = () => {
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState(null);

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
        confirmMessage, setMessage,
        confirmCallback, handleConfirmCallback,
        handleConfirm,
    };
};

export default useConfirmationState;