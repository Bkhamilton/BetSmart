import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function InsightCard({ title }) {

    const { name, description } = title;

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
            <ClearView>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
            </ClearView>
            <ClearView>
                {/* Example Bets Here */}
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        paddingHorizontal: 12,
        height: 120,
        borderRadius: 8,
        paddingTop: 8,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '400',
        width: 300,
    },
});