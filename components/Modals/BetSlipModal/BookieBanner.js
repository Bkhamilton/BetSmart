import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import useTheme from '@/hooks/useTheme';

export default function BookieBanner({ curBookie, onBookieSelect }) {

    const { bookies } = useContext(DBContext);
    const { userBalance } = useContext(UserContext);

    const { bookieColors } = useTheme();

    // Function to get the balance of the current bookie
    const getBalance = (bookieId) => {
        const balance = userBalance.find(b => b.bookieId === bookieId);
        return balance ? balance.balance.toFixed(2) : 0;
    };

    // Function to get the bookie name from the bookieId
    const getBookieName = (bookieId) => {
        const bookie = bookies.find(b => b.id === bookieId);
        return bookie ? bookie.name : '';
    };

    return (
        <TouchableOpacity 
            style={[styles.bookieSelectContainer, { backgroundColor: bookieColors[curBookie.name] }]}
            onPress={onBookieSelect}
        >
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={bookieImages[curBookie.name]} style={{ width: 32, height: 32, borderRadius: 4 }}/>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginLeft: 4 }}>{getBookieName(curBookie.id)}</Text>
            </View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>{getBalance(curBookie.id)}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bookieSelectContainer: {
        padding: 10, 
        borderRadius: 8, 
        margin: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});