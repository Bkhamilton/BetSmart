import React from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { AntDesign } from '@expo/vector-icons';

export default function EditProfileInfo() {

    const { iconColor, grayBackground, grayBorder, backgroundColor } = useTheme();

    const EditComponent = ({ title, placeholder }) => {
        return (
            <ClearView style={{ padding: 8 }}>
                <Text>{title}</Text>
                <TextInput
                    style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                    placeholder={placeholder}
                />
            </ClearView>
        );
    }

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
                    <EditComponent
                        title="Name"
                        placeholder="Enter your name"
                    />
                    {/* Username */}
                    <EditComponent
                        title="Username"
                        placeholder="Enter your username"
                    />
                    {/* Email */}
                    <EditComponent
                        title="Email"
                        placeholder="Enter your email"
                    />
                    {/* Password */}
                    <EditComponent
                        title="Password"
                        placeholder="Enter your password"
                    />
                    {/* Save Changes */}
                </View>
            </ScrollView>
            <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
                <TouchableOpacity style={styles.saveButton}>
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