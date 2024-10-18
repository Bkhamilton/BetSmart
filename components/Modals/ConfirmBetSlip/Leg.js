import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import LegComponent from '../../Home/BetReview/DetailedInfo/LegComponent';

export default function Leg({ leg, legIndex, resolveLeg }) {

    const { grayBackground, redText, backgroundColor } = useTheme();

    const [results, setResults] = useState(null);
    
    const resolve = (result) => {
        leg['result'] = result;
        setResults(result);
        resolveLeg(legIndex, result);
    };

    return (
        <LegComponent leg={leg}>
            <View style={[styles.resultsContainer, { backgroundColor: results === null ? 'transparent' : results ? redText : 'green' }]}>
                <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: results === false ? grayBackground : backgroundColor }]}
                    onPress={() => resolve(false)}
                >
                    <Feather name="x" size={24} color={redText} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: results === true ? grayBackground : backgroundColor }]}
                    onPress={() => resolve(true)}
                >
                    <Feather name="check" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </LegComponent>
    );
}

const styles = StyleSheet.create({
    resultsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderRadius: 8,
    },
    iconButton: {
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        margin: 4,
    },
});