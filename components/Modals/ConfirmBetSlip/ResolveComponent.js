import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function ResolveComponent({ resolvedLegs, totalLegs, handleConfirm, hasPushedLegs }) {
    const { mainGreen, redText, yellowText, backgroundColor, text } = useTheme();
    const wonLegs = resolvedLegs.filter(leg => leg === 1).length;
    const pushedLegs = resolvedLegs.filter(leg => leg === -1).length;
    const lostLegs = resolvedLegs.filter(leg => leg === 0).length;
    
    // A bet is won if:
    // 1. All legs are resolved (no nulls)
    // 2. No legs are lost (0)
    // 3. At least one leg is won (1)
    const betWon = lostLegs === 0 && wonLegs > 0;
    const allPushed = pushedLegs === totalLegs;
    
    // Animation for the result display
    const [fadeAnim] = useState(new Animated.Value(0));
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    const getResultMessage = () => {
        if (allPushed) return 'All Legs Pushed';
        if (betWon) return 'Bet Won!';
        return 'Bet Lost';
    };

    const getResultColor = () => {
        if (allPushed) return yellowText;
        return betWon ? mainGreen : redText;
    };

    const getResultIcon = () => {
        if (allPushed) return "minus-circle";
        return betWon ? "check-circle" : "x-circle";
    };

    return (
        <ClearView style={styles.container}>
            <Animated.View 
                style={[
                    styles.resultContainer,
                    { 
                        backgroundColor: getResultColor() + '20',
                        borderColor: getResultColor(),
                        opacity: fadeAnim
                    }
                ]}
            >
                <View style={styles.resultHeader}>
                    <Feather 
                        name={getResultIcon()} 
                        size={24} 
                        color={getResultColor()} 
                    />
                    <Text style={[
                        styles.resultText,
                        { color: getResultColor() }
                    ]}>
                        {getResultMessage()}
                    </Text>
                </View>
                
                <View style={styles.legsContainer}>
                    <Text style={styles.legsText}>
                        <Text style={{ fontWeight: '600', color: mainGreen }}>{wonLegs}</Text> won,{' '}
                        {pushedLegs > 0 && (
                            <Text style={{ fontWeight: '600', color: yellowText }}>{pushedLegs}</Text>
                        )}
                        {pushedLegs > 0 && ' pushed'}
                        {lostLegs > 0 && (
                            <>
                                {pushedLegs > 0 && ', '}
                                <Text style={{ fontWeight: '600', color: redText }}>{lostLegs}</Text> lost
                            </>
                        )}
                    </Text>
                </View>
            </Animated.View>
            
            <TouchableOpacity 
                style={[
                    styles.resolveButton,
                    { 
                        backgroundColor: getResultColor(),
                        shadowColor: getResultColor()
                    }
                ]}
                onPress={handleConfirm}
            >
                <Text style={styles.buttonText}>Confirm</Text>
                <Feather name="check" size={20} color={backgroundColor} />
            </TouchableOpacity>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        width: '100%',
    },
    resultContainer: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    resultText: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
    legsContainer: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    legsText: {
        fontSize: 16,
        opacity: 0.9,
    },
    resolveButton: {
        width: '100%',
        borderRadius: 8,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        marginRight: 8,
        fontSize: 16,
    },
});