import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Modal, Image } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import useTheme from '@/hooks/useTheme';

export default function AddBookie({ visible, close, addBookie }) {

    const { grayBackground, grayBorder } = useTheme();

    const { bookies } = useContext(DBContext);

    const { userBalance } = useContext(UserContext);

    const [validBookies, setValidBookies] = useState([]);

    useEffect(() => {
        if (!bookies || !userBalance) return;
        const validBookies = bookies.filter(bookie => !userBalance.find(b => b.bookieName === bookie.name));
        setValidBookies(validBookies);
    }, [bookies, userBalance]);

    const BookieButton = ({ bookie }) => {
        return (
            <TouchableOpacity
                style={[styles.bookieButton, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                onPress={() => addBookie(bookie)}
            >
                <Image source={bookieImages[bookie.name]} style={styles.bookieIcon} />
                <Text>{bookie.name}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.container}>
                <ClearView>
                    <TouchableOpacity 
                        onPress={close}
                        style={{ padding: 8 }}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>
                    {validBookies.map(bookie => <BookieButton key={bookie.id} bookie={bookie} />)}
                </ClearView>
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