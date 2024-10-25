import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { bookieImages } from '@/constants/bookieConstants';

export const AltPlayerComponent = ({ player, logo, number, stat, odds }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <View style={[styles.playerIcon, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
                    <Image style={styles.teamIcon} source={{ uri: logo }} />
                </View>
                <Text style={{ fontWeight: '400', fontSize: 16, }}>{player} {number}+ {stat}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.valueContainer}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const MainPlayerComponent = ({ player, logo, value, odds1, odds2 }) => {

    const { grayBackground, grayBorder } = useTheme();

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

export const ToAchieveComponent = ({ player, logo, odds }) => {

    const { grayBackground, grayBorder } = useTheme();

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

export const ToRecordComponent = ({ player, logo, odds, team }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <View style={[styles.playerIcon, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
                    <Image style={styles.teamIcon} source={{ uri: logo }} />
                </View>
                <View style={styles.playerContainer}>
                    <Text style={{ fontWeight: '400', fontSize: 13, }}>{team}</Text>
                </View>
                <TouchableOpacity style={styles.oddsContainer}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={[styles.valueContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                    <Text style={{ fontSize: 24, fontWeight: '500' }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const GenericComponent = ({ title, odds }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View style={styles.genericContainer}>
            <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
                <Text style={{ fontWeight: '400', fontSize: 16, }}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.valueContainer}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const MainLineDisplay = ({ stat, bookie, odds1, odds2, homeTeam, awayTeam }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Away Team Logo */}
                <Image style={styles.logoIcon} source={{ uri: awayTeam.logo }} />
                {/* Away Team Odds */}
                <TouchableOpacity style={styles.oddsContainer}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds1}</Text>
                </TouchableOpacity>         
                {/* Bookie Logo */}
                <Image style={styles.bookieIcon} source={bookieImages[bookie]} />
                {/* Home Team Odds */}
                <TouchableOpacity style={styles.oddsContainer}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds2}</Text>
                </TouchableOpacity>       
                {/* Home Team Logo */}
                <Image style={styles.logoIcon} source={{ uri: homeTeam.logo }} />           
            </View>
        </View>
    );
}
                

const styles = StyleSheet.create({
    genericContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 6
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
        width: 64,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamIcon: {
        width: 20, 
        height: 20,  
        position: 'absolute',
        right: 10,
    },
    playerContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: 180,
    },
    oddsContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,        
    },
    bookieIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
    }
});