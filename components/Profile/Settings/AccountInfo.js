import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, ClearView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';

export default function AccountInfo({ signIn }) {

    const { user, signedIn } = useContext(UserContext);

    const { iconColor, grayBackground } = useTheme();

    const { handleEditProfile } = useRouting();

    useEffect(() => {
        if (!user) return;
    }, [user]);
    
    return (
        <View style={[styles.accountContainer, { backgroundColor: grayBackground }]}>
            <ClearView style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={styles.accountImageContainer}/>
                <ClearView style={styles.accountInfoContainer}>
                    {
                        signedIn ? (
                            <>
                                <Text style={{ fontWeight: '500', fontSize: 18 }}>{user.username}</Text>
                                <TouchableOpacity
                                    style={{ backgroundColor: 'transparent' }}
                                    onPress={handleEditProfile}
                                >
                                    <Text>Profile Settings</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={{ fontWeight: '500', fontSize: 18 }}>No User</Text>
                                <TouchableOpacity
                                    style={{ backgroundColor: 'transparent' }}
                                    onPress={signIn}
                                >
                                    <Text>Sign in</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }

                </ClearView>
            </ClearView>
            <ClearView style={styles.accountArrowContainer}>
                <TouchableOpacity 
                    style={{ backgroundColor: 'transparent', paddingHorizontal: 6, paddingVertical: 10 }}
                    onPress={handleEditProfile}
                >
                    <FontAwesome5 name="chevron-right" size={24} color={iconColor} />
                </TouchableOpacity>
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    accountContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingLeft: 20, 
        paddingVertical: 8,
    },
    accountImageContainer: {
        height: 60, 
        width: 60, 
        borderRadius: 30, 
        borderWidth: 1
    },
    accountInfoContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    accountArrowContainer: {
        justifyContent: 'center',
        paddingRight: 12,
    }
  });
  