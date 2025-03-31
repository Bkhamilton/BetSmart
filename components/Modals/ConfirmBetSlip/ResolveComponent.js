import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function ResolveComponent({ resolvedLegs, totalLegs, handleConfirm }) {
    const { mainGreen, redText, backgroundColor, text } = useTheme();
    const trueLegs = resolvedLegs.filter(leg => leg === true).length;
    const betWon = trueLegs === totalLegs;
    
    // Animation for the result display
    const [fadeAnim] = useState(new Animated.Value(0));
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <ClearView style={styles.container}>
            <Animated.View 
                style={[
                    styles.resultContainer,
                    { 
                        backgroundColor: betWon ? mainGreen + '20' : redText + '20',
                        borderColor: betWon ? mainGreen : redText,
                        opacity: fadeAnim
                    }
                ]}
            >
                <View style={styles.resultHeader}>
                    <Feather 
                        name={betWon ? "check-circle" : "x-circle"} 
                        size={24} 
                        color={betWon ? mainGreen : redText} 
                    />
                    <Text style={[
                        styles.resultText,
                        { color: betWon ? mainGreen : redText }
                    ]}>
                        {betWon ? 'Bet Won!' : 'Bet Lost'}
                    </Text>
                </View>
                
                <View style={styles.legsContainer}>
                    <Text style={styles.legsText}>
                        <Text style={{ fontWeight: '600' }}>{trueLegs}</Text> of <Text style={{ fontWeight: '600' }}>{totalLegs}</Text> legs successful
                    </Text>
                </View>
            </Animated.View>
            
            <TouchableOpacity 
                style={[
                    styles.resolveButton,
                    { 
                        backgroundColor: betWon ? mainGreen : redText,
                        shadowColor: betWon ? mainGreen : redText
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