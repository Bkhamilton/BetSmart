import React, { useState } from 'react';
import { StyleSheet, Modal, StatusBar, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';
import { FontStyle } from '@shopify/react-native-skia';

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
                    style={{ alignItems: 'flex-end'}} 
                >
                    <FontAwesome name='close' size={40} color={'red'}/>
                </TouchableOpacity>

                

                <View style={styles.mainPage}>
                    
                    <View style={styles.title}>
                        <Text style={styles.title}>Sign In</Text>
                    </View>

                    <View style={styles.Username}>
                        <Text style={styles.UsernameTitle}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            // Add necessary props and event handlers for username input
                        />
                    </View>
                    <View style={styles.Password}>
                        <Text style={styles.PasswordTitle}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true}
                            // Add necessary props and event handlers for password input
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 10, 
    borderWidth: 1,
  },
  mainPage: {
    flex: .50,
    borderWidth: 1,
    paddingTop: 10,
    marginTop: 100,
  },
    Username: {
        flex: .50, 
    },
    Password: {
        flex: .50,
    },
    UsernameTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        margin: 10,
    },
    PasswordTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        margin: 10,
    },
    input: {
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    button: {
        width: 300,
        height: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
    },

});
