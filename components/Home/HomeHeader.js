import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { UserContext } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';

export default function HomeHeader({ history, openProfileOptions }) {

    const { iconColor } = useTheme();

    const { signedIn } = useContext(UserContext);
    const router = useRouter();

    const HistoryButton = ({ onPress }) => (
        <TouchableOpacity style={{ marginRight: 8 }} onPress={onPress} accessibilityLabel="Open Bet History">
            <FontAwesome5 name='history' size={28} color={iconColor} />
        </TouchableOpacity>
    );
    
    const SignInButton = ({ onPress }) => (
        <TouchableOpacity onPress={() => router.push('/(tabs)/(index)/login')} accessibilityLabel="Sign In">
            <Ionicons name='person' size={28} color={iconColor} />
        </TouchableOpacity>
    );

    const ProfileButton = ({ onPress }) => (
        <TouchableOpacity onPress={onPress} accessibilityLabel="Open Profile">
            <View style={styles.profileButtonContainer}>
                <FontAwesome6 name='user-large' size={22} color={iconColor} />
            </View>
        </TouchableOpacity>
    );

    return (
        <Header title={'BetSmarter'}>
            { signedIn ?
                <>
                    <HistoryButton onPress={history} />
                    <ProfileButton onPress={openProfileOptions} />
                </>  :
                <SignInButton />
            }
        </Header>
    );
}

const styles = StyleSheet.create({
    profileButtonContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
    },
});