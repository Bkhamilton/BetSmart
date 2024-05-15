import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import Header from '@/components/Header/Header';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function HomeHeader({ history, login, signup }) {

    const { iconColor } = useTheme();

    const HistoryButton = ({ onPress }) => (
        <TouchableOpacity onPress={onPress} accessibilityLabel="Open Bet History">
          <FontAwesome5 name='history' size={28} color={iconColor} />
        </TouchableOpacity>
      );
      
      const LoginButton = ({ onPress }) => (
        <TouchableOpacity onPress={onPress} accessibilityLabel="Open Login">
          <Ionicons name='person' size={28} color={iconColor} />
        </TouchableOpacity>
      );
      
      const SignUpButton = ({ onPress }) => (
        <TouchableOpacity onPress={onPress} accessibilityLabel="Open Sign Up">
          <Ionicons name='person-add' size={28} color={iconColor} />
        </TouchableOpacity>
      );

    return (
        <Header title={'BetSmart'}>
            <HistoryButton onPress={history} />
            <LoginButton onPress={login} />
            <SignUpButton onPress={signup} />
        </Header>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
});