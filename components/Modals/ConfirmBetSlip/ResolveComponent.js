import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function ResolveComponent({ resolvedLegs, totalLegs, handleConfirm }) {

    const trueLegs = resolvedLegs.filter(leg => leg === true).length;

    const { mainGreen } = useTheme();

    return (
        <ClearView style={{ paddingTop : 8 }}>
            <View style={styles.container}>
                <Text>{trueLegs}/{totalLegs} Legs Won</Text>
                <View>
                    {trueLegs === totalLegs ? (
                        <Text>Bet Won!</Text>
                    ) : (
                        <Text>Bet Lost! :(</Text>
                    )}
                </View>
            </View>
            <TouchableOpacity 
                style={[styles.resolveButton, { backgroundColor: mainGreen }]}
                onPress={handleConfirm}
            >
                <Text>Confirm Bet</Text>
            </TouchableOpacity>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        padding: 8, 
        borderWidth: 1, 
        borderRadius: 8,
    },
    resolveButton: {
        width: '100%', 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 6,
    }
});