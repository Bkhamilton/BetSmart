import React, { useState } from 'react';
import { StyleSheet, StatusBar, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput, Modal, ClearView, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function LoginPage({ visible, close, login }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { iconColor, backgroundColor, grayBackground, grayBorder } = useTheme();

    const handleLogin = async () => {
        try {
            const result = await login(username, password);
            if (result) {
                Alert.alert("Success", "You have successfully logged in!");
            } else {
                Alert.alert("Error", "Invalid username or password.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while trying to log in.");
        }
    };

    return (
        <Modal
            animationType="none"
            transparent={false}
            visible={visible}
            onRequestClose={close}
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={close}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 16, }}>
                    <Text style={styles.settingsHeaderText}>Log In</Text> 
                </View>   
            </View>
            <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                <View style={styles.container}>
                    <View style={[styles.editOptionsContainer, { backgroundColor: grayBackground }]}>
                        {/* Username */}
                        <ClearView style={{ padding: 8 }}>
                            <Text>Username</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'Enter your username'}
                                onChangeText={setUsername}
                                value={username}
                                autoCorrect={false}
                            />
                        </ClearView>
                        {/* Password */}
                        <ClearView style={{ padding: 8 }}>
                            <Text>Password</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'Enter your password'}
                                onChangeText={setPassword}
                                value={password}
                                autoCorrect={false}
                                secureTextEntry={true}
                            />
                        </ClearView>
                    </View>
                </View>
            </ScrollView>
            <View>
                <TouchableOpacity 
                    style={{ alignItems: 'center', backgroundColor: 'green', paddingVertical: 12, marginBottom: 36, borderRadius: 8 }}
                    onPress={() => handleLogin()}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        alignItems: 'center',
    },
    settingsHeaderText: {
        fontSize: 32, 
        fontWeight: 'bold'
    },
    editOptionsContainer: {
        paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 40,
    },
    editComponentInput: {
        padding: 12, 
        borderRadius: 16, 
        borderWidth: 1, 
        opacity: 0.8,
        marginTop: 8,
    }
});
