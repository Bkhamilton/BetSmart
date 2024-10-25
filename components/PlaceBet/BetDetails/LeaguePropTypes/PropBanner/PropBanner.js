import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import { Text, View, TouchableOpacity, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { getLogoUrl } from '@/db/general/Teams';
import AltDisplay from './PropTypes/AltDisplay';
import useTheme from '@/hooks/useTheme';

import propBannerMapping from '@/utils/propBannerMapping';

export default function PropBanner({ title, type, player, stat, data }) {

    const { league, currentGame } = useContext(BetContext);

    const { homeTeamName, awayTeamName, homeTeamAbv, awayTeamAbv } = currentGame;

    const { grayBorder, iconColor } = useTheme();

    const { db } = useContext(DBContext);

    const [homeLogo, setHomeLogo] = useState('');
    const [awayLogo, setAwayLogo] = useState('');

    const [detailsOpen, setDetailsOpen] = useState(false);

    const handlePress = () => {
        setDetailsOpen(!detailsOpen);
    };

    const fetchLogos = async () => {
        getLogoUrl(db, homeTeamName).then((url) => setHomeLogo(url.logoUrl + '/tiny'));
        getLogoUrl(db, awayTeamName).then((url) => setAwayLogo(url.logoUrl + '/tiny'));
    };

    useEffect(() => {
        fetchLogos();
    }, [currentGame]);

    const getLogo = () => {
        if ( player ) {
            if ( player === 'Player A' ) {
                return awayLogo;
            } else if ( player === 'Player B' ) {
                return homeLogo;
            }
        }
    };

    const getData = () => {
        if ( stat ) {
            // Get market Data based on stat and targets involved
        }
    }

    const homeTeam = {
        name: homeTeamName,
        abv: homeTeamAbv,
        logo: homeLogo,
    };

    const awayTeam = {
        name: awayTeamName,
        abv: awayTeamAbv,
        logo: awayLogo,
    };

    // Function to get the display component based on type
    const getDisplayComponent = () => {
        // Use MainDisplay as a fallback if type is not found in the mapping
        const DisplayComponent = propBannerMapping[type] || AltDisplay;
        return (
            <DisplayComponent 
                player={player} 
                logo={getLogo()} 
                stat={stat} 
                homeTeam={homeTeam} 
                awayTeam={awayTeam}
                data={data}
            />
        );
    };

    return (
        <View style={{ paddingVertical: 6, width: '100%' }}>
            <TouchableOpacity 
                onPress={handlePress} 
                style={[styles.propContainer, { backgroundColor: grayBorder, borderColor: grayBorder }]}
            >
                <ClearView style={{ justifyContent: 'center', paddingHorizontal: 8, }}>
                    <FontAwesome5 name={detailsOpen ? "chevron-up" : "chevron-down"} size={16} color={iconColor} />
                </ClearView>
                <ClearView>
                    <Text style={{ fontSize: 16 }}>{title}</Text>
                </ClearView>
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
});
