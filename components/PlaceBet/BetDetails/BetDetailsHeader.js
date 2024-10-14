import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import BalanceBox from '@/components/PlaceBet/BalanceBox';

export default function BetDetailsHeader({ league, openChooseBookieModal }) {

    const { handleCloseBetDetails } = useRouting();

    const { iconColor, grayBorder } = useTheme();

    return (
        <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
            <View style={{ flex: 0.3 }}>
                <TouchableOpacity onPress={handleCloseBetDetails}>
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'flex-start', marginLeft: -10, }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{league.leagueName}</Text>
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
        paddingLeft: 20,
        paddingRight: 10, 
        paddingTop: 48,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});