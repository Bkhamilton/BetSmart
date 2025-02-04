import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { updateUserInfo, updateUserPassword } from '@/db/user-specific/Users';
import { AntDesign } from '@expo/vector-icons';

export default function EditProfileInfo() {

    const { iconColor, grayBackground, grayBorder, backgroundColor } = useTheme();
    
    const { user, signedIn } = useContext(UserContext);
    const { db } = useContext(DBContext);

    const [name, setName] = useState(signedIn ? user.name : '');
    const [username, setUsername] = useState(signedIn ? user.username : '');
    const [email, setEmail] = useState(signedIn ? user.email : '');
    const [password, setPassword] = useState('');

    const buildNewUser = () => {
        return {
            id: user.id,
            name: name ? name : user.name,
            username: username ? username : user.username,
            email: email ? email : user.email,
        };
    };

    const handleSaveChanges = () => {
        if (!signedIn) {
            alert('Please sign in to save changes');
            return;
        }
        if (password) {
            updateUserPassword(db, user.id, password);
        } else {
            updateUserInfo(db, buildNewUser());
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                {/* Image Change */}
                <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                    <View style={styles.profileIconContainer}>
                        <View style={styles.profileIcon}></View>
                        <TouchableOpacity style={styles.editButton}>
                            <AntDesign name="edit" size={24} color={iconColor} />
                        </TouchableOpacity>
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
                    {/* Password */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Password</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your password'}
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </ClearView>             
                </View>
            </ScrollView>
            <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveChanges}    
                >
                    <Text>Save Changes</Text>
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
    }
});