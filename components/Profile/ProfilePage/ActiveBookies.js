import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { TouchableOpacity, Text, View, ScrollView, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { bookieImages } from '@/constants/bookieConstants';

export default function ActiveBookies({ addBookie }) {
    
    const { userBalance } = useContext(UserContext);
    
    const { iconColor, grayBorder, grayBackground } = useTheme();

    const BookieButton = ({ bookie }) => {
        return (
            <View style={[styles.bookieButton, { backgroundColor: grayBorder, borderColor: grayBorder }]}>
                <Image style={styles.bookieContainer} source={bookieImages[bookie.bookieName]} />
                <View style={styles.bookieTextContainer}>
                    <Text style={styles.bookieText}>{bookie.bookieName}</Text>
                    <Text style={styles.bookieText}>${bookie.balance.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }}>
                    <Feather name="more-vertical" size={20} color={iconColor} />
                </TouchableOpacity>
            </View>

        );
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Active Bookies</Text>
            </View>
            <View style={[styles.mainContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={{ backgroundColor: 'transparent', paddingLeft: 12 }}
                >
                    <ClearView style={{ flexDirection: 'row' }}>
                        { userBalance.map((bookie) => (
                            <BookieButton key={bookie.bookieId} bookie={bookie} />
                        ))}
                    </ClearView>
                </ScrollView>
                <TouchableOpacity 
                    style={[styles.addBookieContainer, { backgroundColor: grayBorder }]}
                    onPress={addBookie}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Add Bookie</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bookieContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    bookieText: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    bookieTextContainer: {
        marginRight: 8,
        marginLeft: 8,
        backgroundColor: 'transparent',
    },
    bookieButton: {
        flexDirection: 'row', 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 8,
        marginRight: 8,
    },
    addBookieContainer: {
        marginTop: 10,
        marginHorizontal: 12,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    mainContainer: {
        paddingVertical: 12, 
        marginHorizontal: 12, 
        marginVertical: 12, 
        borderWidth: 1, 
        borderRadius: 8,
    }
});