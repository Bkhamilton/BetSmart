import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import BalanceBox from '@/components/PlaceBet/BalanceBox';

export default function SelectGameHeader({ header, openChooseBookieModal }) {

    const { grayBorder } = useTheme();

    return (
        <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
            <View style={{ flex: 0.3 }}>
            
            </View>
            <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{header}</Text>
            </View>
            <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <BalanceBox openModal={openChooseBookieModal}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 84, 
        paddingHorizontal: 10, 
        paddingTop: 48,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});