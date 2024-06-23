import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { getLogoUrl } from '@/db/general/Teams';
import MainPlayer from './PropTypes/MainPlayer';
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
        Player: MainPlayer,
        Alt: AltDisplay,
        Alternate: AltDisplay,
        Main: MainDisplay,
    };

    // Function to get the display component based on type
    const getDisplayComponent = () => {
        // Use MainDisplay as a fallback if type is not found in the mapping
        const DisplayComponent = displayMapping[type] || MainDisplay;
        return <DisplayComponent awayLogo={awayLogo} homeLogo={homeLogo}/>;
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