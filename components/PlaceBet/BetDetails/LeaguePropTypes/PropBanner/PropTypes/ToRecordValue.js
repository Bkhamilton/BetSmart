import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { ToRecordValueComponent } from './ComponentTypes';

export default function ToRecordValue({ awayTeam, homeTeam }) {
    return (
        <View style={{ paddingHorizontal: 8 }}>
            <ToRecordValueComponent team={homeTeam.name} value={26.5} player={"Player A"} logo={homeTeam.logo} odds={'-128'} />
            <ToRecordValueComponent team={awayTeam.name} value={26.5} player={"Player B"} logo={awayTeam.logo} odds={'-118'} />
        </View>
    )
}