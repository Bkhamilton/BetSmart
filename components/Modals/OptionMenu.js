import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';

export default function OptionMenu({ visible, close, options, selectOption }) {
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
                        {options.map((option, index) => (
                            <TouchableOpacity key={index} style={styles.option} onPress={() => selectOption(option)}>
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
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
    optionBox: {
        padding: 16,
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