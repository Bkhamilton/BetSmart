import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function MainPlayer({ awayLogo, homeLogo }) {

    const { grayBackground, grayBorder } = useTheme();

    const PlayerComponent = ({ player, logo, value, odds1, odds2 }) => {
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
                        <Text style={{ fontSize: 14 }}>O {value}</Text>
                        <Text style={{ fontSize: 14, color: 'blue' }}>{odds1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.valueContainer}>
                        <Text style={{ fontSize: 14 }}>U {value}</Text>
                        <Text style={{ fontSize: 14, color: 'blue' }}>{odds2}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={{ width: '100%', paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', backgroundColor: grayBackground, paddingVertical: 4 }}>
                <View style={{ paddingHorizontal: 8, backgroundColor: 'transparent' }}>
                    <Text style={{ fontSize: 16 }}>OVER</Text>
                </View>
                <View style={{ paddingHorizontal: 8, backgroundColor: 'transparent' }}>
                    <Text style={{ fontSize: 16 }}>UNDER</Text>
                </View>
            </View>
            <View style={{ paddingHorizontal: 8 }}>
                <PlayerComponent player={'Player A'} logo={awayLogo} value={4.5} odds1={'-113'} odds2={'-113'} />
                <PlayerComponent player={'Player B'} logo={homeLogo} value={3.5} odds1={'+108'} odds2={'-136'} />
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
    },
    teamIcon: {
        width: 20, 
        height: 20,  
        position: 'absolute',
        right: 10,
    },
});