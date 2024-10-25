import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { MainPlayerComponent } from './ComponentTypes';
import useTheme from '@/hooks/useTheme';

export default function MainPlayer({ awayTeam, homeTeam }) {

    const { grayBackground } = useTheme();

    return (
        <View style={{ width: '100%', paddingBottom: 4 }}>
            <View style={[styles.container, { backgroundColor: grayBackground }]}>
                <ClearView style={{ paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 16 }}>OVER</Text>
                </ClearView>
                <ClearView style={{ paddingHorizontal: 16 }}>
                    <Text style={{ fontSize: 16 }}>UNDER</Text>
                </ClearView>
            </View>
            <View style={{ paddingHorizontal: 8 }}>
                <MainPlayerComponent player={'Player A'} logo={awayTeam.logo} value={4.5} odds1={'-113'} odds2={'-113'} />
                <MainPlayerComponent player={'Player B'} logo={homeTeam.logo} value={3.5} odds1={'+108'} odds2={'-136'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        width: '100%', 
        paddingVertical: 4
    },
});