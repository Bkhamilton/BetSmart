import { useState } from 'react';

const useConfirmationState = () => {
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState(null);

    function setMessage(message) {
        setConfirmMessage(message);
    }

    function setCallback(callback) {
        setConfirmCallback(callback);
    }

    const handleConfirm = (response) => {
        if (confirmCallback) {
          confirmCallback(response);
        }
    };

    return {
        confirmMessage, setMessage,
        confirmCallback, setCallback,
        handleConfirm,
    };
};

export default useConfirmationState;