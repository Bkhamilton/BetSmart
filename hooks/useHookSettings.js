import { useState } from 'react';

const useHookSettings = () => {

    const [helpModalVisible, setHelpModalVisible] = useState(false);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

    const handleHelpModal = () => {
        setHelpModalVisible(!helpModalVisible);
    }

    const handleAboutModal = () => {
        setAboutModalVisible(!aboutModalVisible);
    }

    const handlePrivacyModal = () => {
        setPrivacyModalVisible(!privacyModalVisible);
    }

    return {
        helpModalVisible,
        aboutModalVisible,
        privacyModalVisible,
        handleHelpModal,
        handleAboutModal,
        handlePrivacyModal,
    };
};

export default useHookSettings;