import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_SPACING = 16;

export default function InsightCard({ title }) {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={[styles.card, { width: CARD_WIDTH, backgroundColor: grayBackground, borderColor: grayBorder }]}>
            <ClearView>
                <Text style={styles.nameText}>{title.name}</Text>
                <Text style={styles.descriptionText}>{title.description}</Text>
            </ClearView>
            <ClearView>
                {/* Example Bets Here */}
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginRight: CARD_SPACING,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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