import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function PropBanner({ title, type }) {
    const { iconColor } = useTheme();
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handlePress = () => {
        setDetailsOpen(!detailsOpen);
    };

    const PlayerDisplay = () => {
        return (
            <View style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 16 }}>{title}</Text>
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
});