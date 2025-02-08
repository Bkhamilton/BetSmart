import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';

export default function ProfilePageHeader() {

    const { user, signedIn } = useContext(UserContext);

    const { iconColor, grayBorder } = useTheme();

    const { handleBetHistory, handleSettings } = useRouting();

    return (
        <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {signedIn ? user.username : 'BetSmarter'}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity 
                    onPress={handleBetHistory} 
                    accessibilityLabel="Open Bet History"
                    style={{ marginRight: 14 }}
                >
                    <FontAwesome5 name='history' size={28} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSettings}
                    accessibilityLabel="Open Settings"
                >
                    <FontAwesome name="cog" size={28} color={iconColor}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});