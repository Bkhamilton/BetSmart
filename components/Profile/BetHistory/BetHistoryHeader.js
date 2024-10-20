import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import ChooseBetType from '@/components/Profile/BetHistory/ChooseBetType';

export default function BetHistoryHeader({ changeType, selectedType }) {

    const { iconColor } = useTheme();

    const { handleProfilePage } = useRouting();

    return (
        <>
            <View style={styles.headerContainer}>
                <View style={{ flex: 0.2, }}>
                    <TouchableOpacity 
                        onPress={handleProfilePage}
                    >
                        <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                    </TouchableOpacity>  
                </View>
                <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600' }}>All Bets</Text>
                </View>
                <View style={{ flex: 0.2 }}>

                </View>
            </View>
            <ChooseBetType selectType={changeType} type={selectedType}/>
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});