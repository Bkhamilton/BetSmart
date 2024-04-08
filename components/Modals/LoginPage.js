import React, { useState } from 'react';
import { StyleSheet, Modal, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function LoginPage({ visible, close }) {

    return (
        <Modal
            animationType="none"
            transparent={false}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={close}
                    style={{ alignItems: 'flex-end' }} 
                >
                    <FontAwesome name='close' size={24} color={'red'}/>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 10, 
  },
});
