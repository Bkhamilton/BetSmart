import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { ToRecordComponent } from './ComponentTypes';

export default function ToRecord({ awayTeam, homeTeam }) {
    return (
        <View style={{ paddingHorizontal: 8 }}>
            <ToRecordComponent team={homeTeam.name} player={"Player A"} logo={homeTeam.logo} odds={'-128'} />
            <ToRecordComponent team={awayTeam.name} player={"Player B"} logo={awayTeam.logo} odds={'-118'} />
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
        width: 75,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamIcon: {
        width: 20, 
        height: 20,  
        position: 'absolute',
        right: 10,
    },
});