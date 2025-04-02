import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity, Text, View, ClearView, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_SPACING = 16;

export default function BankManagement({ streak, deposits = 100, withdrawals = 50, depositTrend = 'neutral' }) {
    const { grayBackground, grayBorder, iconColor, greenText, redText } = useTheme();

    // Mock data - replace with your actual data later
    const cards = [
        {
            id: 'summary',
            title: 'Weekly Summary',
            content: `Deposits: $${deposits}\nWithdrawals: $${withdrawals}`,
            footer: 'Last 7 Days',
            color: grayBackground
        },
        ...(streak === 'hot' ? [{
            id: 'hot-streak',
            title: 'Hot Streak!',
            content: withdrawals === 0 
                ? 'Consider withdrawing some profits to secure your winnings!'
                : 'Great job managing your bankroll during this winning streak!',
            footer: 'Bankroll Advice',
            color: greenText
        }] : []),
        ...(streak === 'cold' ? [{
            id: 'cold-streak',
            title: 'Cold Streak',
            content: depositTrend === 'high' 
                ? 'Your recent deposits are high. Consider taking a break to reassess.'
                : 'Every bettor goes through slumps. Stick to your strategy.',
            footer: 'Bankroll Advice',
            color: redText
        }] : []),
        {
            id: 'general-advice',
            title: 'Bankroll Tip',
            content: streak === 'neutral' 
                ? 'Maintain consistent bet sizes (1-2% of bankroll per wager)'
                : 'Review your monthly spending limits regularly',
            footer: 'Professional Advice',
            color: grayBackground
        }
    ];

    return (
        <ClearView style={styles.container}>
            <View style={{ paddingBottom: 8, paddingLeft: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Bank Management</Text>
            </View>
            
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                snapToAlignment="start"
                contentContainerStyle={styles.scrollContainer}
                decelerationRate="fast"
            >
                {cards.map((card) => (
                    <View 
                        key={card.id}
                        style={[
                            styles.card,
                            { 
                                width: CARD_WIDTH,
                                backgroundColor: card.color,
                                borderColor: grayBorder,
                                shadowColor: iconColor
                            }
                        ]}
                    >
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.cardContent}>{card.content}</Text>
                        <Text style={styles.cardFooter}>{card.footer}</Text>
                    </View>
                ))}
            </ScrollView>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    scrollContainer: {
        paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
        paddingVertical: 8,
    },
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    cardContent: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    cardFooter: {
        fontSize: 10,
        opacity: 0.6,
        fontWeight: '400',
        marginTop: 'auto',
    },
});