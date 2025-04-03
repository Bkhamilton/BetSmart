import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View, TextInput } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { DBContext } from '@/contexts/DBContext';
import { bookieImages } from '@/constants/bookieConstants';
import { getPlayersByTeamName } from '@/db/general/Players';
import SelectPlayer from '@/components/Modals/SelectPlayer';

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
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.oddsContainer}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds}</Text>
                </TouchableOpacity>                
                <TouchableOpacity style={[styles.valueContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                    <Text style={{ fontSize: 24, fontWeight: '500' }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const ToRecordValueComponent = ({ odds, values, team, select }) => {

    const { db } = useContext(DBContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [players, setPlayers] = useState([]);
    const [target, setTarget] = useState(team.name);

    const openPlayerModal = (team) => {
        getPlayersByTeamName(db, team).then((res) => {
            setPlayers(res);
        });
        setModalVisible(true);
    }

    const selectPlayer = (player) => {
        setTarget(player.name);
        setModalVisible(false);
    }

    const { grayBackground, grayBorder } = useTheme();

    const [oddsVal, setOddsVal] = useState(odds);
    const [val, setVal] = useState(values[0]);

    useEffect(() => {
        setVal(values[0]);
    }, [values]);

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <View style={[styles.playerIcon, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
                        { team.logo !== '' ? <Image style={styles.teamIcon} source={{ uri: team.logo }} /> : null }
                    </View>
                    <TouchableOpacity 
                        style={styles.playerContainer}
                        onPress={() => openPlayerModal(team.name)}
                    >
                        <Text style={{ fontWeight: '400', fontSize: 13, }}>{target}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        placeholder={val}
                        keyboardType="default"
                        style={styles.oddsContainer}
                        value={val}
                        onChangeText={(text) => {
                            if (/^[0-9.]*$/.test(text)) {
                                setVal(text);
                            }
                        }}
                    />
                    <TextInput
                        placeholder={odds}
                        keyboardType="default"
                        style={styles.oddsContainer}
                        value={oddsVal}
                        onChangeText={(text) => {
                            if (/^[0-9+-]*$/.test(text)) {
                                setOddsVal(text);
                            }
                        }}
                        // Add necessary props and event handlers for amount input
                    />  
                    <TouchableOpacity 
                        style={[styles.valueContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                        onPress={() => select(team.name, val, oddsVal)}
                    >
                        <Text style={{ fontSize: 24, fontWeight: '500' }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SelectPlayer
                visible={modalVisible}
                close={() => setModalVisible(false)}
                players={players}
                selectPlayer={selectPlayer}
            />
        </>
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
                { awayTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: awayTeam.logo }} /> : null }
                {/* Away Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds2}</Text>
                </TouchableOpacity>         
                {/* Bookie Logo */}
                <Image style={styles.bookieIcon} source={bookieImages[bookie]} />
                {/* Home Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds1}</Text>
                </TouchableOpacity>       
                {/* Home Team Logo */}
                { homeTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: homeTeam.logo }} /> : null }       
            </View>
        </View>
    );
}     

export const MainLineValueDisplay = ({ stat, value, bookie, odds1, odds2, homeTeam, awayTeam }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Away Team Logo */}
                { awayTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: awayTeam.logo }} /> : null }
                {/* Away Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds2}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', opacity: 0.8}}>{value}</Text>
                </TouchableOpacity>         
                {/* Bookie Logo */}
                <Image style={styles.bookieIcon} source={bookieImages[bookie]} />
                {/* Home Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{odds1}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', opacity: 0.8}}>{value}</Text>
                </TouchableOpacity>       
                {/* Home Team Logo */}
                { homeTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: homeTeam.logo }} /> : null }
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
    },
    oddsContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
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