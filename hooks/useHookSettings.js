import { useState } from 'react';

const useHookSettings = () => {

    const [helpModalVisible, setHelpModalVisible] = useState(false);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    const handleHelpModal = () => {
        setHelpModalVisible(!helpModalVisible);
    }

    const handleAboutModal = () => {
        setAboutModalVisible(!aboutModalVisible);
    }

    return {
        helpModalVisible,
        aboutModalVisible,
        handleHelpModal,
        handleAboutModal,
    };
};

export default useHookSettings;