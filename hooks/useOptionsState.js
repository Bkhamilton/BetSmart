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

    const handleOption = (response) => {
        if (optionCallback) {
          optionCallback(response);
        }
    }

    const onHandleOption = (response) => {
        handleOption(response);
        closeOptionsModal();
    }
  
    const handleOpenOptions = async (target, options, handleResponse) => {
      setOptionsList(options);
      openOptionsModal();
  
      // response is the option selected
      const response = await new Promise((resolve) => {
        handleOptionCallback(() => resolve);
      });
  
      // handle the response
      if (response) {
        await handleResponse(response, target);
      }
    };

    return {
        optionsModalVisible,
        options,   
        optionCallback,
        openOptionsModal,
        closeOptionsModal,
        setOptionsList,
        handleOptionCallback,
        handleOption,
        onHandleOption,
        handleOpenOptions,
    };
};

export default useOptionsState;