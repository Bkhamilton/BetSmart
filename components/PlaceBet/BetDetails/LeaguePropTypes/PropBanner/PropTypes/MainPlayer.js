import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { MainPlayerComponent } from './ComponentTypes';
import useTheme from '@/hooks/useTheme';

export default function MainPlayer({ awayLogo, homeLogo }) {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={{ width: '100%', paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', backgroundColor: grayBackground, paddingVertical: 4 }}>
                <View style={{ paddingHorizontal: 8, backgroundColor: 'transparent' }}>
                    <Text style={{ fontSize: 16 }}>OVER</Text>
                </View>
                <View style={{ paddingHorizontal: 16, backgroundColor: 'transparent' }}>
                    <Text style={{ fontSize: 16 }}>UNDER</Text>
                </View>
            </View>
            <View style={{ paddingHorizontal: 8 }}>
                <MainPlayerComponent player={'Player A'} logo={awayLogo} value={4.5} odds1={'-113'} odds2={'-113'} />
                <MainPlayerComponent player={'Player B'} logo={homeLogo} value={3.5} odds1={'+108'} odds2={'-136'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        borderWidth: 1,
        paddingVertical: 1,
    },
    playerIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 16,
        borderWidth: 2,
    },
    valueContainer: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderColor: 'blue',
        marginHorizontal: 4,
        width: 64,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamIcon: {
        width: 20, 
        height: 20,  
        position: 'absolute',
        right: 10,
    },
});