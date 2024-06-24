import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
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