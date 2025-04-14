import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import useRouting from '@/hooks/useRouting';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';

export default function ProfileOptions({ visible, close, onSignOut }) {

    const { user } = useContext(UserContext);

    const { handleSettings, handleProfilePage } = useRouting();

    const { grayBackground, grayBorder } = useTheme();

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
                        <TouchableOpacity 
                            style={[styles.option, { borderColor: grayBorder, backgroundColor: grayBackground }]} 
                            onPress={goToProfile}
                        >
                            <Text style={styles.optionText}>{user?.username}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.option, { borderColor: grayBorder, backgroundColor: grayBackground }]} 
                            onPress={goToSettings}
                        >
                            <Text style={styles.optionText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.option, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                            onPress={onSignOut}
                        >
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
        borderRadius: 8,
    },
    option: {
        padding: 12,
        borderRadius: 4,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 16,
    },
});