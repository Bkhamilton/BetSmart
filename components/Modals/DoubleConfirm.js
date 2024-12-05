import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';

export default function DoubleConfirm({ visible, close, confirm }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.container}>
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>
                        ARE YOU SURE YOU WANT TO PROCEED?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => confirm(true)}>
                            <Text style={styles.buttonText}>YES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => confirm(false)}>
                            <Text style={styles.buttonText}>NO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    messageBox: {
        padding: 16,
        borderRadius: 8,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 16,
        width: 250,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 16,
    },
});