import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Linking } from 'react-native';
import { Text, View, Modal, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function PrivacySettings({ visible, close }) {

    const { grayBackground, grayBorder } = useTheme();

    const privacyFeatures = [{
        id: 1,
        title: 'Data Collection',
        description: 'This app does not collect or store any personal data. Your betting information and preferences are stored locally on your device and are not shared with anyone.',
    },
    {
        id: 2,
        title: 'Notifications',
        description: 'Push notifications are currently not available. This section will allow you to manage notification preferences when they are added in a future update.'
    },
    {
        id: 3,
        title: 'Location Services',
        description: 'Location services are not used in this app. This section will allow you to manage location preferences when they are added in a future update.'
    }];

    const openPrivacyPolicy = () => {
        Linking.openURL('https://github.com/Bkhamilton/BetSmart/blob/main/PrivacyPolicy.md');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.container}>
                    <View style={styles.privacyBox}>
                        <View style={{ paddingVertical: 8 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Privacy Settings</Text>
                        </View>
                        {
                            privacyFeatures.map((feature) => (
                                <View key={feature.id} style={{ paddingVertical: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{feature.id}. {feature.title}</Text>
                                    <Text style={{ fontSize: 14 }}>{feature.description}</Text>
                                </View>
                            ))
                        }
                        <View style={{ paddingVertical: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>4. Privacy Policy</Text>
                            <Text style={{ fontSize: 14 }}>Read our privacy policy to learn more about how we handle your information.</Text>
                            <TouchableOpacity 
                                style={[styles.privacyButton, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                                onPress={openPrivacyPolicy}
                            >
                                <Text style={{ fontSize: 14 }}>View Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    privacyBox: {
        padding: 16,
        borderRadius: 8,
    },
    privacyButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});