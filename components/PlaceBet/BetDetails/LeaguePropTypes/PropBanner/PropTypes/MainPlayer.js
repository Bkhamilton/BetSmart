import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { ToRecordValueComponent } from './ComponentTypes';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import { getBetTargetIdByName } from '@/db/bet-general/BetTargets';

export default function MainPlayer({ stat, awayTeam, homeTeam }) {

    const { currentGame, selectProp, bookieId } = useContext(BetContext);

    const { db } = useContext(DBContext);

    const getStatName = (stat) => {
        switch (stat) {
            case 'Player Points':
                return 'pts';
            case 'Player Assists':
                return 'ast';
            case 'Player Rebounds':
                return 'reb';
            case 'Player Threes':
                return '3pt';
            case 'Player Defense':
                return 'def';
            case 'Player Pass Yards':
                return 'passYds';
            case 'Player Rush Yards':
                return 'rushYds';
            case 'Player Rec Yards':
                return 'recYds';
            default:
                return stat;
        }
    }

    const onSelectProp = async (player, value, odds) => {
        const target = await getBetTargetIdByName(db, player.name);
        selectProp({
            game: currentGame,
            type: stat,
            target: target,
            stat: getStatName(stat),
            value: value,
            overUnder: 'over',
            odds: odds,
            bookieId: bookieId,
        });
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
        paddingRight: 32,
    },
});