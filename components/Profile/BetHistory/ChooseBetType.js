import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';
import useTheme from '@/hooks/useTheme';

export default function ChooseBetType({ selectType, type }) {

    const { grayBorder } = useTheme();

    return (
        <View>
            <View style={[styles.container, { borderColor: grayBorder }]}>
                <TouchableOpacity 
                    style={[
                        styles.typeContainer, 
                        type === 'Open' && styles.activeTypeContainer
                    ]}
                    onPress={() => selectType('Open')}
                >
                    <Text style={[styles.typeText, type === 'Open' && styles.activeType]}>Open</Text>
                </TouchableOpacity>
                <View style={[styles.border, { borderColor: grayBorder }]} />
                <TouchableOpacity
                    style={[
                        styles.typeContainer,
                        type === 'Settled' && styles.activeTypeContainer
                    ]}
                    onPress={() => selectType('Settled')}
                >
                    <Text style={[styles.typeText, type === 'Settled' && styles.activeType]}>Settled</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        width: '100%',
        flexDirection: 'row',
    },
    typeContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6
    },
    typeText: {
        fontSize: 16,
    },
    activeType: {
        fontWeight: 'bold',
    },
    activeTypeContainer: {
        borderBottomWidth: 4,
        borderBottomColor: 'black',
    },
    border: {
        borderLeftWidth: 1,
        height: '100%',
    },
});