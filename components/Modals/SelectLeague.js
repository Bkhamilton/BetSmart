import React, { useContext } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import useTheme from '@/hooks/useTheme';

export default function SelectLeague({ visible, close, selectLeague }) {

    const onSelect = (league) => {
        selectLeague(league);
        close();
    }

    const { leagues } = useContext(DBContext);

    const { grayBackground, grayBorder } = useTheme();

    const LeagueDisplay = ({ league }) => {
        return (
            <TouchableOpacity
                style={[styles.leagueContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                onPress={() => onSelect(league)}
            >
                <Text>{league.leagueName}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.container}>
                <View style={{ backgroundColor: 'transparent' }}>
                    <TouchableOpacity 
                        onPress={close}
                        style={{ padding: 8 }}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>
                    { leagues.map(league => <LeagueDisplay key={league.id} league={league} />) }
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leagueContainer: {
        padding: 10,
        borderWidth: 1,
    },
});