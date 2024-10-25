import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { ToAchieveComponent } from './ComponentTypes';

export default function ToAchieve({ awayLogo, homeLogo }) {
    return (
        <View style={{ paddingHorizontal: 8 }}>
            <ToAchieveComponent player={"Player A"} logo={homeLogo} odds={'-128'} />
            <ToAchieveComponent player={"Player B"} logo={awayLogo} odds={'-118'} />
            <ToAchieveComponent player={"Player C"} logo={homeLogo} odds={'-102'} />
            <ToAchieveComponent player={"Player D"} logo={awayLogo} odds={'+102'} />
            <ToAchieveComponent player={"Player E"} logo={awayLogo} odds={'+116'} />
        </View>
    )
}