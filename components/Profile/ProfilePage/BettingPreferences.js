import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';

export default function BettingPreferences() {

    const { iconColor, grayBorder, grayBackground } = useTheme();

    const { handleEditPreferences } = useRouting();

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Betting Preferences</Text>
            </View>
            <View style={[styles.mainContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Bankroll:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>$1000</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Daily Limit:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>$100</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Unit Size:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>S ($5) M ($10) L ($20)</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Preferred Leagues:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>NBA, NFL</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Preferred Bet Types:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>ML, Spread, O/U</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Risk Tolerance:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Moderate</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Odds Format:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>American</Text>
                </ClearView>
                <TouchableOpacity
                    style={[styles.addBookieContainer, { backgroundColor: grayBorder }]}
                    onPress={handleEditPreferences}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Edit Preferences</Text>    
                </TouchableOpacity>                                                                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addBookieContainer: {
        marginTop: 10,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    mainContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12, 
        marginHorizontal: 12, 
        marginVertical: 12, 
        borderWidth: 1, 
        borderRadius: 8,
    },
    preferenceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});