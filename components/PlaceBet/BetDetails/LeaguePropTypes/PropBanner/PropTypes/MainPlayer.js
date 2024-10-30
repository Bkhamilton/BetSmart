import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { MainPlayerComponent, ToRecordValueComponent } from './ComponentTypes';
import useTheme from '@/hooks/useTheme';

export default function MainPlayer({ awayTeam, homeTeam }) {

    const { grayBackground } = useTheme();

    const onSelectProp = (player, value, odds) => {
        console.log('Selected Prop:', player, value, odds);
    }

    return (
        <View style={{ width: '100%', paddingBottom: 4 }}>
            <View style={[styles.container, { backgroundColor: grayBackground }]}>
                <ClearView style={{ paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 16 }}>VALUE</Text>
                </ClearView>
                <ClearView style={{ paddingHorizontal: 4, marginRight: 44 }}>
                    <Text style={{ fontSize: 16 }}>ODDS</Text>
                </ClearView>
            </View>
            <View style={{ paddingHorizontal: 8 }}>
                <ToRecordValueComponent value={4.5} team={awayTeam} odds={'-113'} select={onSelectProp}/>
                <ToRecordValueComponent value={3.5} team={homeTeam} odds={'+108'} select={onSelectProp}/>
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
        paddingVertical: 4,
    },
});