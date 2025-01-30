import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput, ScrollView, ClearView, Modal } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SignUpPage({ visible, close, signUp }) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { iconColor, backgroundColor, grayBackground, grayBorder } = useTheme();

    const onSignUp = async () => {
        // Check if each field is filled out
        if (!username || !email || !name || !password || !confirmPassword) {
            alert('Please fill out all fields');
            return;
        }
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Call the signUp function from the parent component
        signUp(username, email, name, password);
    }

    return (
        <Modal
            animationType="none"
            transparent={false}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={close}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 16, }}>
                    <Text style={styles.settingsHeaderText}>Sign Up</Text> 
                </View>   
            </View>
            <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                <View style={styles.container}>
                    <View style={[styles.editOptionsContainer, { backgroundColor: grayBackground }]}>
                        {/* Name */}
                        <ClearView style={{ padding: 8 }}>
                            <Text>Name</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'Enter your name'}
                                onChangeText={setName}
                                value={name}
                                autoCorrect={false}
                            />
                        </ClearView>
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
                        {/* Email */}
                        <ClearView style={{ padding: 8 }}>
                            <Text>Email</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'Enter your email address'}
                                onChangeText={setEmail}
                                value={email}
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
                        {/* Confirm Password */}
                        <ClearView style={{ padding: 8 }}>
                            <Text>Confirm Password</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'Confirm your password'}
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                                autoCorrect={false}
                                secureTextEntry={true}
                            />
                        </ClearView>
                    </View>
                </View>
            </ScrollView>
            {/* Sign Up Button */}
            <View>
                <TouchableOpacity 
                    style={{ alignItems: 'center', backgroundColor: 'green', padding: 12, marginBottom: 36, borderRadius: 8, marginHorizontal: 8 }}
                    onPress={onSignUp}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
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