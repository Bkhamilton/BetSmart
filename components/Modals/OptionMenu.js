import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function OptionMenu({ visible, close, options, selectOption }) {

    const { grayBackground, grayBorder } = useTheme();

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
                            <TouchableOpacity 
                                key={index} 
                                style={[styles.option, { borderColor: grayBorder, backgroundColor: grayBackground }]} 
                                onPress={() => selectOption(option)}
                            >
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
        marginVertical: 4,
    },
    optionText: {
        fontSize: 16,
    },
});