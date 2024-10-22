import React, { useState } from 'react';
import { StyleSheet, Modal, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SignUpPage({ visible, close }) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { iconColor } = useTheme();

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
                {/* Main Modal Box */}
                <View style={styles.mainPage}>
                    {/* Title */}
                    <View style={styles.title}>
                        <Text style={styles.title}>Sign Up</Text>
                        <View style={styles.underline}></View>
                    </View>
                    {/* Username input */}
                    <View style={styles.infoBox}>
                        <Text style={styles.BoxTitle}>Username</Text>
                        <View style={styles.inputBox}>
                            <FontAwesome name='user' size={24} color={iconColor} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                onChangeText={setUsername}
                                autoCorrect={false}
                                // Add necessary props and event handlers for username input
                            />
                        </View>
                    </View>
                    {/* Email input */}
                    <View style={styles.infoBox}>
                        <Text style={styles.BoxTitle}>Email</Text>
                        <View style={styles.inputBox}>
                            <FontAwesome name='envelope' size={24} color={iconColor} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                onChangeText={setEmail}
                                autoCorrect={false}
                                // Add necessary props and event handlers for email input
                            />
                        </View>
                    </View>
                    {/* Name input */}
                    <View style={styles.infoBox}>
                        <Text style={styles.BoxTitle}>Name</Text>
                        <View style={styles.inputBox}>
                            <FontAwesome name='user' size={24} color={iconColor} />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                onChangeText={setName}
                                autoCorrect={false}
                                // Add necessary props and event handlers for name input
                            />
                        </View>
                    </View>
                    {/* Password input */}
                    <View style={styles.infoBox}>
                        <Text style={styles.BoxTitle}>Password</Text>
                        <View style={styles.inputBox}>
                            <FontAwesome name='lock' size={24} color={iconColor} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry={true}
                                onChangeText={setPassword}
                                autoCorrect={false}
                                // Add necessary props and event handlers for password input
                            />
                        </View>
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
        flex: 1,
        paddingTop: 10,
        marginTop: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 5,
    },
    underline: {
        borderWidth: 1,
        width: 150,
        height: 1,
        opacity: 0.2,
    },
    infoBox: {
        flex: .50,
        marginTop: 20, 
    },
    BoxTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    input: {
        width: 300,
        height: 40,
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});