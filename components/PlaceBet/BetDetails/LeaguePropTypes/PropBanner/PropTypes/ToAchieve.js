import React from 'react';
import { View } from '@/components/Themed';
import { ToAchieveComponent } from './ComponentTypes';

export default function ToAchieve({ awayTeam, homeTeam }) {
    return (
        <View style={{ paddingHorizontal: 8 }}>
            <ToAchieveComponent player={"Player A"} logo={homeTeam.logo} odds={'-128'} />
            <ToAchieveComponent player={"Player B"} logo={awayTeam.logo} odds={'-118'} />
            <ToAchieveComponent player={"Player C"} logo={homeTeam.logo} odds={'-102'} />
            <ToAchieveComponent player={"Player D"} logo={awayTeam.logo} odds={'+102'} />
            <ToAchieveComponent player={"Player E"} logo={homeTeam.logo} odds={'+116'} />
        </View>
    )
}