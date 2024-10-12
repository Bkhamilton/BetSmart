import { useState } from 'react';

const useOptionsState = () => {
    
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [options, setOptions] = useState([]);
    const [optionCallback, setOptionCallback] = useState(null);

    function openOptionsModal() {
        setOptionsModalVisible(true);
    }

    function closeOptionsModal() {
        setOptionsModalVisible(false);
    }

    function setOptionsList(optionsList) {
        setOptions(optionsList);
    }

    function handleOptionCallback(callback) {
        setOptionCallback(callback);
    }

    return {
        optionsModalVisible,
        options,   
        optionCallback,
        openOptionsModal,
        closeOptionsModal,
        setOptionsList,
        handleOptionCallback,
    };
};

export default useOptionsState;