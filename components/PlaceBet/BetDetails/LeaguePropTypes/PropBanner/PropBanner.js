import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { getLogoUrl } from '@/db/general/Teams';
import useTheme from '@/hooks/useTheme';

export default function PropBanner({ title, type }) {

    const { league, currentGame } = useContext(BetContext);

    const { homeTeamName, awayTeamName } = currentGame;

    const { grayBackground, grayBorder } = useTheme();

    const [homeLogo, setHomeLogo] = useState('');
    const [awayLogo, setAwayLogo] = useState('');

    const { iconColor } = useTheme();
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handlePress = () => {
        setDetailsOpen(!detailsOpen);
    };

    const db = useSQLiteContext();

    const fetchLogos = async () => {
        getLogoUrl(db, homeTeamName).then((url) => setHomeLogo(url.logoUrl + '/tiny'));
        getLogoUrl(db, awayTeamName).then((url) => setAwayLogo(url.logoUrl + '/tiny'));
    };

    useEffect(() => {
        fetchLogos();
    }, [currentGame]);

    const PlayerDisplay = () => {

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
                        <TouchableOpacity style={styles.valueContainer} onPress={() => console.log(JSON.stringify(currentGame, null, 2))}>
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

    const AltDisplay = () => {
        return (
            <View style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 16 }}>{title}</Text>
            </View>
        )
    }

    const MainDisplay = () => {
        return (
            <View style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 16 }}>{title}</Text>
            </View>
        )
    }

    // Mapping of type to display components
    const displayMapping = {
        Player: PlayerDisplay,
        Alt: AltDisplay,
        Alternate: AltDisplay,
        Main: MainDisplay,
    };

    // Function to get the display component based on type
    const getDisplayComponent = () => {
        // Use MainDisplay as a fallback if type is not found in the mapping
        const DisplayComponent = displayMapping[type] || MainDisplay;
        return <DisplayComponent />;
    };

    return (
        <View style={{ paddingVertical: 6, width: '100%' }}>
            <TouchableOpacity onPress={handlePress} style={styles.propContainer}>
                <View style={{ justifyContent: 'center', paddingHorizontal: 8, }}>
                    <FontAwesome5 name={detailsOpen ? "chevron-up" : "chevron-down"} size={16} color={iconColor} />
                </View>
                <View>
                    <Text style={{ fontSize: 16 }}>{title}</Text>
                </View>
            </TouchableOpacity>
            {detailsOpen && getDisplayComponent()}
        </View>
    );
}

const styles = StyleSheet.create({
    propContainer: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
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