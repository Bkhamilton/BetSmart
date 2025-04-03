import React, { useContext } from 'react';
import { StyleSheet, Modal, Image, Dimensions } from 'react-native';
import { TouchableOpacity, Text, View, ClearView, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SelectPlayer({ visible, close, players, selectPlayer }) {
    const { grayBackground, grayBorder, text } = useTheme();

    const PlayerCard = ({ player }) => {
        return (
            <TouchableOpacity
                style={[styles.playerCard, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                onPress={() => selectPlayer(player)}
            >
                <Image 
                    source={{ uri: player.image }} 
                    style={[styles.playerImage, { backgroundColor: grayBorder }]} 
                />
                <Text style={[styles.playerName, { color: text }]}>{player.name}</Text>
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
            <View style={styles.modalOverlay}>
                <ClearView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Player</Text>
                        <TouchableOpacity 
                            onPress={close}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView
                        style={styles.playersContainer}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {players.map(player => (
                            <PlayerCard key={player.id} player={player} />
                        ))}
                    </ScrollView>
                </ClearView>
            </View>
        </Modal>
    );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: windowHeight * 0.7,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    playersContainer: {
        width: '100%',
    },
    scrollContent: {
        paddingBottom: 8,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    playerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    playerName: {
        fontSize: 16,
        fontWeight: '500',
    },
});