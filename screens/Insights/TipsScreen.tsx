import React from 'react';
import { View, Text, ClearView } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import useTheme from '@/hooks/useTheme';

export default function TipsView() {
    const { grayText } = useTheme();

    return (
        <ClearView style={styles.container}>
            <View style={styles.placeholderCard}>
                <Text style={styles.title}>Tips Coming Soon</Text>
                <Text style={[styles.description, { color: grayText }]}>
                    This section will contain personalized betting tips and recommendations based on your betting history and preferences.
                </Text>
            </View>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderCard: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        maxWidth: 400,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
});
