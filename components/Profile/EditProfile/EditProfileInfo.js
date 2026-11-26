import React, { useState } from 'react';
import { Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { validateProfileFields } from '@/services/authValidation';

export default function EditProfileInfo({ updateProfile, updatePassword, authError, isLoading }) {

    const { iconColor, grayBackground, grayBorder, backgroundColor } = useTheme();
    const { user, signedIn } = React.useContext(UserContext);

    const [name, setName] = useState(user?.name ?? '');
    const [username, setUsername] = useState(user?.username ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [password, setPassword] = useState('');

    const handleSaveChanges = async () => {
        if (!signedIn || !user) {
            Alert.alert('Sign in required', 'Sign in to update your account.');
            return;
        }
        const validationError = validateProfileFields({ name, username, email });
        if (validationError) {
            Alert.alert('Check your details', validationError);
            return;
        }

        const profileSaved = await updateProfile({ name, username, email });
        if (profileSaved && password) {
            const passwordSaved = await updatePassword(password);
            if (passwordSaved) {
                setPassword('');
                Alert.alert('Account updated', 'Your profile and password were updated.');
            }
        } else if (profileSaved) {
            Alert.alert('Account updated', 'Your profile was saved.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                {/* Image Change */}
                <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                    <View style={{ marginTop: 20, height: 100, width: 100, borderRadius: 50, borderWidth: 1, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                        <FontAwesome6 name="user-large" size={80} color={iconColor} />
                    </View>
                </View>
                <View style={[styles.editOptionsContainer, { backgroundColor: grayBackground }]}>
                    {/* Name */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Name</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your name'}
                            autoCorrect={false}
                            value={name}
                            onChangeText={setName}
                        />
                    </ClearView>
                    {/* Username */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Username</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your username'}
                            autoCorrect={false}
                            value={username}
                            onChangeText={setUsername}
                        />
                    </ClearView>                    
                    {/* Email */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Email</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your email address'}
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </ClearView>                    
                    {/* New Password */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>New Password</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter a new password'}
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </ClearView>             
                </View>
                {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
            </ScrollView>
            <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveChanges}    
                    disabled={isLoading}
                >
                    <Text>{isLoading ? 'Saving...' : 'Save Changes'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#00A86B',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 4,
    },
    profileIconContainer: {
        position: 'relative',
        alignItems: 'center',
        paddingTop: 12,
    },
    profileIcon: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: '#ccc',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 8,
        backgroundColor: '#00A86B',
        borderRadius: 50,
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
    },
    errorText: {
        color: '#c62828',
        padding: 8,
    },
});