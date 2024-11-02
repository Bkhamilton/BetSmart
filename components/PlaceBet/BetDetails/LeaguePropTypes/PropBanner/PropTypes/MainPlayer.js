import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { ToRecordValueComponent } from './ComponentTypes';
import useTheme from '@/hooks/useTheme';

export default function MainPlayer({ stat, awayTeam, homeTeam }) {

    const { grayBackground } = useTheme();

    const onSelectProp = (player, value, odds) => {
        console.log('Selected Prop:', stat, player, value, odds);
    }

    const pointValues = ['10', '15', '18', '20', '25', '30']

    const assistValues = ['5', '6', '7', '8', '9', '10']

    const reboundValues = ['8', '10', '12', '14', '16', '18']

    const threesValues = ['1', '2', '3', '4']

    const stealsValues = ['1', '2', '3', '4']

    const getValues = (stat) => {
        switch (stat) {
            case 'Player Points':
                return pointValues;
            case 'Player Assists':
                return assistValues;
            case 'Player Rebounds':
                return reboundValues;
            case 'Player Threes':
                return threesValues;
            case 'Player Defense':
                return stealsValues;
            default:
                return pointValues;
        }
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
                <ToRecordValueComponent team={awayTeam} odds={'-113'} values={getValues(stat)} select={onSelectProp}/>
                <ToRecordValueComponent team={homeTeam} odds={'+108'} values={getValues(stat)} select={onSelectProp}/>
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