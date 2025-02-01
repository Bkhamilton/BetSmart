import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import { useRouter } from 'expo-router';

export default function BetDetailsHeader({ league, openChooseBookieModal }) {

    const router = useRouter();

    const { iconColor, grayBorder } = useTheme();

    return (
        <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
            <View style={{ flex: 0.3 }}>
                <TouchableOpacity onPress={() => router.back()}>
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