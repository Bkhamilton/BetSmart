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
    const [target, setTarget] = useState(team);
    const [oddsVal, setOddsVal] = useState(odds);
    const [val, setVal] = useState(values[0]);
    
    const { grayBackground, grayBorder, text, primary } = useTheme();

    useEffect(() => {
        setVal(values[0]);
    }, [values]);

    const openPlayerModal = (team) => {
        getPlayersByTeamName(db, team).then((res) => {
            setPlayers(res);
        });
        setModalVisible(true);
    }

    const selectPlayer = (player) => {
        setTarget(player);
        setModalVisible(false);
    }

    return (
        <>
            <View style={styles.container}>
                {/* Team/Player Section */}
                <TouchableOpacity 
                    style={styles.teamPlayerContainer}
                    onPress={() => openPlayerModal(team.name)}
                >
                    {
                        target.image ? (
                            <View style={styles.avatarContainer}>
                                <Image 
                                    source={{ uri: target.image }} 
                                    style={[styles.playerIcon, { backgroundColor: grayBackground, borderColor: grayBorder }]} 
                                />
                                {team.logo && (
                                    <Image 
                                        style={styles.teamLogo} 
                                        source={{ uri: team.logo }} 
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        ) : (
                            <View style={styles.avatarContainer}>
                                <View style={[styles.playerIcon, { backgroundColor: grayBackground, borderColor: grayBorder }]}/>
                                {team.logo && (
                                    <Image 
                                        style={styles.teamLogo} 
                                        source={{ uri: team.logo }} 
                                        resizeMode="contain"
                                    />
                                )}
                            </View>                            
                        )
                    }
                    <Text style={[styles.playerName, { color: text }]} numberOfLines={1}>
                        {target.name}
                    </Text>
                </TouchableOpacity>

                {/* Odds/Value Input Section */}
                <View style={styles.inputsContainer}>
                    <TextInput
                        placeholder={val}
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        style={[styles.valueInput, { borderColor: grayBorder }]}
                        value={val}
                        onChangeText={(text) => {
                            if (/^[0-9.]*$/.test(text)) {
                                setVal(text);
                            }
                        }}
                    />
                    
                    <TextInput
                        placeholder={odds}
                        placeholderTextColor="#999"
                        keyboardType="numbers-and-punctuation"
                        style={[styles.oddsInput, { borderColor: grayBorder }]}
                        value={oddsVal}
                        onChangeText={(text) => {
                            if (/^[0-9+-]*$/.test(text)) {
                                setOddsVal(text);
                            }
                        }}
                    />
                    
                    <TouchableOpacity 
                        style={[styles.addButton, { backgroundColor: grayBorder }]}
                        onPress={() => select(target, val, oddsVal)}
                    >
                        <Text style={styles.addButtonText}>+</Text>
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

export const MainLineDisplay = ({ stat, bookie, home, away, homeTeam, awayTeam }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Away Team Logo */}
                { awayTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: awayTeam.logo }} /> : null }
                {/* Away Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{away.odds}</Text>
                </TouchableOpacity>         
                {/* Bookie Logo */}
                <Image style={styles.bookieIcon} source={bookieImages[bookie]} />
                {/* Home Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{home.odds}</Text>
                </TouchableOpacity>       
                {/* Home Team Logo */}
                { homeTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: homeTeam.logo }} /> : null }       
            </View>
        </View>
    );
}     

export const TotalLineDisplay = ({ stat, bookie, over, under, homeTeam, awayTeam }) => {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Away Team Logo */}
                { awayTeam.logo !== '' ? <Image style={styles.logoIcon} source={{ uri: awayTeam.logo }} /> : null }
                {/* Away Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{over.odds}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', opacity: 0.8}}>{over.value}</Text>
                </TouchableOpacity>         
                {/* Bookie Logo */}
                <Image style={styles.bookieIcon} source={bookieImages[bookie]} />
                {/* Home Team Odds */}
                <TouchableOpacity style={[styles.oddsContainer, { backgroundColor: grayBackground, borderColor: grayBorder, width: 80 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{under.odds}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', opacity: 0.8}}>{under.value}</Text>
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
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    teamPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    playerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
    },
    teamLogo: {
        width: 16,
        height: 16,
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    playerName: {
        fontSize: 13,
        fontWeight: '500',
        flexShrink: 1,
    },
    inputsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueInput: {
        width: 52,
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginRight: 8,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    oddsInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginRight: 8,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
});