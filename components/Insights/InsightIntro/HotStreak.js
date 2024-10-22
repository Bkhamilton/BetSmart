import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function HotStreak() {

    const { redText } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.streakContainer, { borderColor: redText }]}>
                <FontAwesome5 name="fire" size={20} color={redText} style={{ marginHorizontal: 2 }}/>
                <Text style={{ fontSize: 20, fontWeight: '500', color: redText }}>Hot Streak</Text>
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