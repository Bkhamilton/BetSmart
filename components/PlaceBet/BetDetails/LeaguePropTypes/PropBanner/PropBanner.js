import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function PropBanner({ title }) {
    const { iconColor } = useTheme();
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handlePress = () => {
        setDetailsOpen(!detailsOpen);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <View style={{ justifyContent: 'center', paddingHorizontal: 8, }}>
                <FontAwesome5 name="chevron-down" size={16} color={iconColor} />
            </View>
            <View>
                <Text style={{ fontSize: 16 }}>{title}</Text>
            </View>
            {detailsOpen && (
                <View>
                    {/* Detailed view goes here */}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 4
    },
});