import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SettingsOptions({ onPress }) {

    const { iconColor } = useTheme();

    function SettingsOption({ icon, title, pressIcon, onPress }) {
        return (
            <View style={styles.optionContainer}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Ionicons name={icon} size={18} color={iconColor} />
                    <Text style={styles.optionText}>{title}</Text>
                </TouchableOpacity>
                    <TouchableOpacity style={{ addingHorizontal: 6, paddingVertical: 6 }}>
                    <FontAwesome5 name={pressIcon} size={24} color={iconColor} />
                </TouchableOpacity>
            </View>
        );
    }

    const accountData = [
        { icon: 'moon', title: 'Dark Mode', pressIcon: 'toggle-on' },
        { icon: 'notifications', title: 'Notifications', pressIcon: 'chevron-right' },
        { icon: 'lock-open', title: 'Privacy', pressIcon: 'chevron-right' },
        { icon: 'eye-off', title: 'Security', pressIcon: 'chevron-right' },
        { icon: 'help-circle', title: 'Help', pressIcon: 'chevron-right' },
        { icon: 'information-circle', title: 'About', pressIcon: 'chevron-right' },
    ]

    return (
        <View style={{ paddingVertical: 20 }}>
            {accountData.map((item) => (
                <View key={item.title} style={{ marginVertical: 4 }}>
                    <SettingsOption
                        icon={item.icon}
                        title={item.title}
                        pressIcon={item.pressIcon}
                        onPress={() => onPress(item.title)}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  optionContainer: {
    paddingVertical: 6,
    paddingLeft: 20,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 6,
  },
});
  