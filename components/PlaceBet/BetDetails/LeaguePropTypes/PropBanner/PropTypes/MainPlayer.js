import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { ToRecordValueComponent } from './ComponentTypes';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

export default function MainPlayer({ stat, awayTeam, homeTeam }) {

    const { league, currentGame, selectProp } = useContext(BetContext);

    const { grayBackground } = useTheme();

    const onSelectProp = (player, value, odds) => {
        console.log('Selected Prop:', stat, player, value, odds);
        // selectProp needs: game, type, target, stat, value, overUnder, odds, bookieId
    }

    const pointValues = ['10', '15', '18', '20', '25', '30']

    const assistValues = ['5', '6', '7', '8', '9', '10']

    const reboundValues = ['8', '10', '12', '14', '16', '18']

    const threesValues = ['1', '2', '3', '4']

    const stealsValues = ['1', '2', '3', '4']

    const passYardsValues = ['150', '180', '200', '220', '250']

    const rushYardsValues = ['50', '75', '100', '125', '150']

    const recYardsValues = ['50', '75', '100', '125', '150']

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
            case 'Player Pass Yards':
                return passYardsValues;
            case 'Player Rush Yards':
                return rushYardsValues;
            case 'Player Rec Yards':
                return recYardsValues;
            default:
                return pointValues;
        }
    }

    const [homeTarget, setHomeTarget] = useState(null);
    const [awayTarget, setAwayTarget] = useState(null);

    return (
        <View style={{ width: '100%', paddingBottom: 4 }}>
            <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                <ClearView style={{ paddingHorizontal: 16 }}>
                    <Text style={{ fontSize: 16, opacity: 0.6 }}>VALUE</Text>
                </ClearView>
                <ClearView style={{ paddingHorizontal: 4, marginRight: 44 }}>
                    <Text style={{ fontSize: 16, opacity: 0.6 }}>ODDS</Text>
                </ClearView>
            </View>
            <View style={{ paddingHorizontal: 8 }}>
                <ToRecordValueComponent team={awayTeam} odds={'-113'} values={getValues(stat)} select={onSelectProp} target={awayTarget}/>
                <ToRecordValueComponent team={homeTeam} odds={'+108'} values={getValues(stat)} select={onSelectProp} target={homeTarget}/>
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
        paddingRight: 32,
    },
});