import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput, ClearView, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import useAuthState from '@/hooks/useAuthState';

export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { iconColor, grayBackground, grayBorder, greenText, buttonGreen } = useTheme();
    const router = useRouter();
    const { login, requestPasswordReset, resendConfirmation, authError, isLoading } = useAuthState();

    const handleLogin = async () => {
        try {
            const result = await login(email, password);
            if (result) {
                Alert.alert("Success", "You have successfully logged in!");
                router.replace('/(tabs)/(index)');
            }
        } catch (error) {
            Alert.alert("Sign in failed", error instanceof Error ? error.message : "Please try again.");
        }
    };

    const handlePasswordReset = async () => {
        if (!email.trim()) {
            Alert.alert("Enter your email", "Enter your email address first so we can send a reset link.");
            return;
        }
        const sent = await requestPasswordReset(email);
        if (sent) Alert.alert("Check your email", "If an account exists for that address, a password reset link has been sent.");
    };

    const handleResendConfirmation = async () => {
        if (!email.trim()) {
            Alert.alert("Enter your email", "Enter your email address first so we can resend a confirmation link.");
            return;
        }
        const sent = await resendConfirmation(email);
        if (sent) Alert.alert("Check your email", "If the address needs confirmation, a new link has been sent.");
    };

    const handleSignUp = () => {
        router.push('/(tabs)/(index)/signup');
    };

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => router.back()}
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
                        {/* Email */}
                        <ClearView style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                placeholder={'Enter your email'}
                                onChangeText={setEmail}
                                value={email}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
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
                                autoComplete="password"
                                autoCorrect={false}
                                autoCapitalize="none"
                                secureTextEntry={true}
                            />
                        </ClearView>
                    </View>

                    {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: buttonGreen }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePasswordReset} disabled={isLoading} style={styles.resetLink}>
                        <Text style={{ color: greenText }}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleResendConfirmation} disabled={isLoading} style={styles.resetLink}>
                        <Text style={{ color: greenText }}>Resend confirmation email</Text>
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
        </>
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
    resetLink: {
        alignItems: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: '#c62828',
        marginBottom: 12,
        textAlign: 'center',
    },
});
