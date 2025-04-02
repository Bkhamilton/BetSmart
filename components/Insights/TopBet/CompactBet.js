import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import LegComponent from '@/components/Home/BetReview/DetailedInfo/LegComponent';
import CompactLeg from './CompactLeg';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function CompactBet({ bet }) {
    const { grayBorder, iconColor } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <Pressable onPress={toggleExpand}>
            {({ pressed }) => (
                <View style={[
                    styles.container, 
                    { 
                        borderColor: grayBorder,
                        opacity: pressed ? 0.8 : 1
                    }
                ]}>
                    {/* Compact View (always visible) */}
                    <View style={styles.compactHeader}>
                        <View style={styles.compactInfo}>
                            <Text style={styles.compactLeague}>{bet.league}</Text>
                            <Text style={styles.compactOdds}>{bet.odds}</Text>
                        </View>
                        <View style={styles.compactMeta}>
                            <Text style={styles.compactDate}>{bet.date}</Text>
                            <Text style={styles.compactLegs}>{bet.legs.length} leg{bet.legs.length !== 1 ? 's' : ''}</Text>
                        </View>
                        <Feather 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={18} 
                            color={iconColor} 
                            style={styles.expandIcon}
                        />
                    </View>

                    {/* Expanded View (conditionally visible) */}
                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.matchupText}>
                                {bet.homeTeamAbv} vs {bet.awayTeamAbv}
                            </Text>
                            {bet.legs.map((leg, index) => (
                                <CompactLeg 
                                    key={index} 
                                    leg={leg} 
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    compactHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    compactInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    compactLeague: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    compactOdds: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2ecc71',
    },
    compactMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    compactDate: {
        fontSize: 12,
        opacity: 0.7,
        marginRight: 12,
    },
    compactLegs: {
        fontSize: 12,
        opacity: 0.7,
    },
    expandIcon: {
        opacity: 0.6,
    },
    expandedContent: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 10,
    },
    matchupText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
});