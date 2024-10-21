import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import useRouting from '@/hooks/useRouting';
import { UserContext } from '@/contexts/UserContext';

export default function ProfileOptions({ visible, close, onSignOut }) {

    const { user } = useContext(UserContext);

    const { handleSettings, handleProfilePage } = useRouting();

    const goToProfile = () => {
        close();
        handleProfilePage();
    }

    const goToSettings = () => {
        close();
        handleSettings();
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.container}>
                    <View style={styles.optionBox}>
                        <TouchableOpacity style={styles.option} onPress={goToProfile}>
                            <Text style={styles.optionText}>{user?.username}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={goToSettings}>
                            <Text style={styles.optionText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={onSignOut}>
                            <Text style={styles.optionText}>Sign Out</Text>
                        </TouchableOpacity>                                                
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
        paddingLeft: 110,
    },
    optionBox: {
        padding: 4,
        borderRadius: 8,
    },
    option: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 16,
    },
});