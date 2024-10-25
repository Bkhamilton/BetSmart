import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { ToRecordComponent } from './ComponentTypes';

export default function ToRecord({ awayTeam, homeTeam }) {
    return (
        <View style={{ paddingHorizontal: 8 }}>
            <ToRecordComponent team={homeTeam.name} player={"Player A"} logo={homeTeam.logo} odds={'-128'} />
            <ToRecordComponent team={awayTeam.name} player={"Player B"} logo={awayTeam.logo} odds={'-118'} />
        </View>
    )
}