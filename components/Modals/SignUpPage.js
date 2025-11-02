import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput, ScrollView, ClearView, Modal } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import EditPreferences from '@/components/Profile/BetPreferences/EditPreferences';
import { UserContext } from '@/contexts/UserContext';

export default function SignUpPage({ visible, close, signUp }) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPreferences, setShowPreferences] = useState(false);

    const { iconColor, backgroundColor, grayBackground, grayBorder, buttonGreen } = useTheme();
    const { updatePreferences } = useContext(UserContext);

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
        const result = await signUp(username, email, name, password);
        if (result) {
            // Show preferences screen instead of closing
            setShowPreferences(true);
        }
    }

    const handleSavePreferences = async (prefs) => {
        await updatePreferences(prefs);
        // Reset state and close modal
        setShowPreferences(false);
        setUsername('');
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        close();
    }

    const handleClose = () => {
        // Reset state when closing
        setShowPreferences(false);
        setUsername('');
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        close();
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={handleClose}
        >
            {showPreferences ? (
                // Show preferences after signup
                <>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity 
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <FontAwesome5 name="times" size={24} color={iconColor} />
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 16, }}>
                            <Text style={styles.preferencesHeaderText}>Set Your Preferences</Text> 
                        </View>
                    </View>
                    <EditPreferences 
                        userPreferences={{
                            bankroll: 0,
                            dailyLimit: 0,
                            unitSize: '',
                            preferredLeagues: [],
                            preferredBetTypes: [],
                            riskTolerance: 0,
                            oddsFormat: '',
                        }}
                        setUserPreferences={() => {}}
                        updatePreferences={handleSavePreferences}
                    />
                </>
            ) : (
                // Show signup form
                <>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity 
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <FontAwesome5 name="times" size={24} color={iconColor} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        style={{ flex: 1 }} 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.container}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.welcomeText}>Create Account</Text>
                                <Text style={styles.subtitleText}>Sign up to get started</Text>
                            </View>

                            <View style={styles.formContainer}>
                                {/* Name */}
                                <ClearView style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Name</Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                        placeholder={'Enter your full name'}
                                        onChangeText={setName}
                                        value={name}
                                        autoCorrect={false}
                                    />
                                </ClearView>
                                
                                {/* Username */}
                                <ClearView style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Username</Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                        placeholder={'Choose a username'}
                                        onChangeText={setUsername}
                                        value={username}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />
                                </ClearView>
                                
                                {/* Email */}
                                <ClearView style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Email</Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                        placeholder={'Enter your email address'}
                                        onChangeText={setEmail}
                                        value={email}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </ClearView>
                                
                                {/* Password */}
                                <ClearView style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Password</Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                        placeholder={'Create a password'}
                                        onChangeText={setPassword}
                                        value={password}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        secureTextEntry={true}
                                    />
                                </ClearView>
                                
                                {/* Confirm Password */}
                                <ClearView style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Confirm Password</Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                        placeholder={'Confirm your password'}
                                        onChangeText={setConfirmPassword}
                                        value={confirmPassword}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        secureTextEntry={true}
                                    />
                                </ClearView>
                            </View>

                            <TouchableOpacity 
                                style={[styles.signUpButton, { backgroundColor: buttonGreen }]}
                                onPress={onSignUp}
                            >
                                <Text style={styles.signUpButtonText}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 20, 
        paddingTop: 48,
        paddingBottom: 12,
        alignItems: 'center',
    },
    closeButton: {
        padding: 8,
    },
    preferencesHeaderText: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginLeft: 8,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 20,
    },
    titleContainer: {
        marginBottom: 40,
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
        marginBottom: 24,
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
    signUpButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});