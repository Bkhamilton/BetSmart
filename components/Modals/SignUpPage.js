import React, { useState } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SignUpPage({ visible, close, signUp }) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { iconColor } = useTheme();

    const SignUpComponent = ({iconName, placeholder, state, setState}) => {
        return (
            <View style={styles.infoBox}>
                <Text style={styles.BoxTitle}>{placeholder}</Text>
                <View style={styles.inputBox}>
                    <FontAwesome name={iconName} size={24} color={iconColor} />
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        onChangeText={setState}
                        value={state}
                        autoCorrect={false}
                    />
                </View>
            </View>
        );
    }

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
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={close}
                    style={{ alignItems: 'flex-end', paddingRight: 20 }} 
                >
                    <FontAwesome name='close' size={40} color={'red'}/>
                </TouchableOpacity>
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
                            placeholder='Username'
                            onChangeText={setUsername}
                            value={username}
                            autoCorrect={false}
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
                            placeholder='Email'
                            onChangeText={setEmail}
                            value={email}
                            autoCorrect={false}
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
                            placeholder='Name'
                            onChangeText={setName}
                            value={name}
                            autoCorrect={false}
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
                            placeholder='Password'
                            onChangeText={setPassword}
                            value={password}
                            autoCorrect={false}
                        />
                    </View>
                </View>
                {/* Confirm Password input */}
                <View style={styles.infoBox}>
                    <Text style={styles.BoxTitle}>Confirm Password</Text>
                    <View style={styles.inputBox}>
                        <FontAwesome name='lock' size={24} color={iconColor} />
                        <TextInput
                            style={styles.input}
                            placeholder='Confirm Password'
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            autoCorrect={false}
                        />
                    </View>
                </View>
                {/* Sign Up Button */}
                <TouchableOpacity 
                    style={{ alignItems: 'center', marginTop: 20, backgroundColor: 'green', padding: 10 }}
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
        paddingTop: 46,
    },
    mainPage: {
        flex: 1,
        paddingTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 15,
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
        paddingLeft: 20,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
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