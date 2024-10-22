import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function ColdStreak() {

    const { accentBlue } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.streakContainer, { borderColor: accentBlue }]}>
                <FontAwesome5 name="snowflake" size={20} color={accentBlue} style={{ marginHorizontal: 2 }}/>
                <Text style={{ fontSize: 20, fontWeight: '500', color: accentBlue }}>Cold Streak</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
    },
    streakContainer: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    }
});