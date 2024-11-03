import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Modal, Image } from 'react-native';
import { TouchableOpacity, Text, View, ClearView, ScrollView } from '@/components/Themed';
import { ModalContext } from '@/contexts/BetContext/ModalContext';
import useTheme from '@/hooks/useTheme';

export default function ChoosePlayer() {

    const { playerModal, closePlayerModal, players, selectPlayer } = useContext(ModalContext);

    const { grayBackground, grayBorder } = useTheme();

    const PlayerBanner = ({ player }) => {
        return (
            <TouchableOpacity
                style={[styles.bookieButton, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                onPress={() => selectPlayer(player)}
            >
                <Image source={{ uri: player.image }} style={styles.bookieIcon} />
                <Text>{player.name}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={playerModal}
            onRequestClose={closePlayerModal}
        >
            <View style={styles.container}>
                <ScrollView
                    style={{ backgroundColor: 'transparent' }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity 
                        onPress={closePlayerModal}
                        style={{ padding: 8 }}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>
                    {players.map(player => <PlayerBanner key={player.id} player={player} />)}
                </ScrollView>
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
    bookieButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    bookieIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
    }
});