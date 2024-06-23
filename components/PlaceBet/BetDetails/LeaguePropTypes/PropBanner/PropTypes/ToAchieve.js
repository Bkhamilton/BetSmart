import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function ToAchieve({ awayLogo, homeLogo }) {

    const { grayBackground, grayBorder } = useTheme();

    const ToAchieveComponent = ({ player, logo, odds }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <View style={[styles.playerIcon, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
                        <Image style={styles.teamIcon} source={{ uri: logo }} />
                    </View>
                    <Text style={{ fontWeight: '400', fontSize: 16, }}>{player}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.valueContainer}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={{ width: '100%', paddingBottom: 4 }}>
            <View style={{ paddingHorizontal: 8 }}>
                <ToAchieveComponent player={"Player A"} logo={homeLogo} odds={'-128'} />
                <ToAchieveComponent player={"Player B"} logo={awayLogo} odds={'-118'} />
                <ToAchieveComponent player={"Player C"} logo={homeLogo} odds={'-102'} />
                <ToAchieveComponent player={"Player D"} logo={awayLogo} odds={'+102'} />
                <ToAchieveComponent player={"Player E"} logo={awayLogo} odds={'+116'} />
            </View>

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