import React, { useState } from 'react';
import { StyleSheet, StatusBar, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput, Modal, ClearView, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function LoginPage({ visible, close, login, handleSignUp }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { iconColor, backgroundColor, grayBackground, grayBorder, greenText } = useTheme();

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
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={close}
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={close}
                    style={styles.closeButton}
                >
                    <FontAwesome5 name="times" size={24} color={iconColor} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.subtitleText}>Sign in to continue</Text>
                    </View>
                    
                    <View style={styles.formContainer}>
                        {/* Username */}
                        <ClearView style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput
                                style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                placeholder={'Enter your username'}
                                onChangeText={setUsername}
                                value={username}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                        </ClearView>
                        
                        {/* Password */}
                        <ClearView style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                placeholder={'Enter your password'}
                                onChangeText={setPassword}
                                value={password}
                                autoCorrect={false}
                                autoCapitalize="none"
                                secureTextEntry={true}
                            />
                        </ClearView>
                    </View>

                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => handleLogin()}
                    >
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity 
                            onPress={handleSignUp}
                        >
                            <Text style={[styles.signUpLink, { color: greenText }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20, 
        paddingTop: 48,
        paddingBottom: 12,
        alignItems: 'center',
    },
    closeButton: {
        padding: 8,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    titleContainer: {
        marginBottom: 48,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 32, 
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        opacity: 0.7,
    },
    formContainer: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        padding: 16, 
        borderRadius: 12, 
        borderWidth: 1, 
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#10b981',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 15,
    },
    signUpLink: {
        fontSize: 15,
        fontWeight: '600',
    },
});
