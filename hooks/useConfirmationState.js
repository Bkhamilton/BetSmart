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

    return {
        confirmMessage, setMessage,
        confirmCallback, setCallback,
    };
};

export default useConfirmationState;