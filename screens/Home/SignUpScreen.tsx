import React, { useState, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, TextInput, ScrollView, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import useAuthState from '@/hooks/useAuthState';
import EditPreferences from '@/components/Profile/BetPreferences/EditPreferences';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { Preference, Bookie } from '@/constants/types';
import { bookieImages } from '@/constants/bookieConstants';
import { useSQLiteContext } from 'expo-sqlite';
import { insertBalance } from '@/db/user-specific/Balance';

export default function SignUpScreen() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'signup' | 'preferences' | 'bookies'>('signup');
    const [selectedBookies, setSelectedBookies] = useState<number[]>([]);

    const { iconColor, grayBackground, grayBorder, buttonGreen } = useTheme();
    const router = useRouter();
    const { signUp } = useAuthState();
    const { updatePreferences, user } = useContext(UserContext);
    const { leagues, bookies } = useContext(DBContext);
    const db = useSQLiteContext();

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
            // Move to preferences step
            setStep('preferences');
        }
    }

    const handleSavePreferences = async (prefs: Preference) => {
        await updatePreferences(prefs);
        // Move to bookies selection step
        setStep('bookies');
    }

    const toggleBookieSelection = (bookieId: number) => {
        setSelectedBookies(prev => 
            prev.includes(bookieId) 
                ? prev.filter(id => id !== bookieId)
                : [...prev, bookieId]
        );
    };

    const handleFinishOnboarding = async (retryCount = 0) => {
        const MAX_RETRIES = 5;
        
        // Ensure user is available before adding bookies
        if (!user) {
            if (retryCount < MAX_RETRIES) {
                console.warn(`User not available yet, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                // Try again after a short delay
                setTimeout(() => handleFinishOnboarding(retryCount + 1), 500);
            } else {
                console.error('User not available after maximum retries');
                alert('Failed to complete setup. Please restart the sign-up process.');
            }
            return;
        }
        
        // Add all selected bookies to user's active bookies
        if (selectedBookies.length > 0) {
            for (const bookieId of selectedBookies) {
                await insertBalance(db, bookieId, 0, user.id);
            }
        }
        // Navigate to home - use replace to prevent going back to signup
        router.replace('/(tabs)/(index)');
    };

    // If showing bookies selection, render bookies selection UI
    if (step === 'bookies') {
        return (
            <>
                <View style={styles.headerContainer}>
                    <TouchableOpacity 
                        onPress={() => router.replace('/(tabs)/(index)')}
                        style={styles.closeButton}
                    >
                        <FontAwesome5 name="times" size={24} color={iconColor} />
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Text style={styles.preferencesHeaderText}>Choose Your Sportsbooks</Text> 
                    </View>
                </View>
                <ScrollView 
                    style={{ flex: 1 }} 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <Text style={styles.subtitle}>Select the sportsbooks you plan to use</Text>
                        
                        <View style={styles.bookiesGrid}>
                            {bookies.map((bookie: Bookie) => (
                                <TouchableOpacity
                                    key={bookie.id}
                                    style={[
                                        styles.bookieCard,
                                        { 
                                            backgroundColor: grayBackground, 
                                            borderColor: selectedBookies.includes(bookie.id) ? buttonGreen : grayBorder,
                                            borderWidth: selectedBookies.includes(bookie.id) ? 3 : 1,
                                        }
                                    ]}
                                    onPress={() => toggleBookieSelection(bookie.id)}
                                >
                                    <Image source={bookieImages[bookie.name as keyof typeof bookieImages]} style={styles.bookieImage} />
                                    <Text style={styles.bookieName}>{bookie.name}</Text>
                                    {selectedBookies.includes(bookie.id) && (
                                        <View style={[styles.checkmark, { backgroundColor: buttonGreen }]}>
                                            <FontAwesome5 name="check" size={12} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity 
                            style={[
                                styles.finishButton, 
                                { 
                                    backgroundColor: selectedBookies.length > 0 ? buttonGreen : grayBorder,
                                    opacity: selectedBookies.length > 0 ? 1 : 0.5,
                                }
                            ]}
                            onPress={handleFinishOnboarding}
                            disabled={selectedBookies.length === 0}
                            accessibilityLabel={selectedBookies.length > 0 
                                ? `Add ${selectedBookies.length} sportsbook${selectedBookies.length > 1 ? 's' : ''} and continue` 
                                : 'Select at least one sportsbook to continue'}
                            accessibilityHint={selectedBookies.length === 0 ? 'This button is disabled. Please select at least one sportsbook.' : undefined}
                        >
                            <Text style={styles.finishButtonText}>
                                {selectedBookies.length > 0 
                                    ? `Add ${selectedBookies.length} Sportsbook${selectedBookies.length > 1 ? 's' : ''} & Continue` 
                                    : 'Select at least one sportsbook'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </>
        );
    }

    // If showing preferences, render EditPreferences component
    if (step === 'preferences') {
        return (
            <>
                <View style={styles.headerContainer}>
                    <TouchableOpacity 
                        onPress={() => router.back()}
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
                    leagues={leagues}
                    onSave={handleSavePreferences}
                />
            </>
        );
    }

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
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        textAlign: 'center',
        marginBottom: 30,
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
    bookiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    bookieCard: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bookieImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginBottom: 12,
    },
    bookieName: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    finishButton: {
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
    finishButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
