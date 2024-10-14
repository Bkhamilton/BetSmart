import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import useTheme from '@/hooks/useTheme';

export default function BalanceBox({ openModal }) {

    const { userBalance } = useContext(UserContext);
    const { bookie, setBookie, bookieId, setBookieId } = useContext(BetContext);

    const [curBookie, setCurBookie] = useState({ balance: 0 });

    useEffect(() => {
        if (userBalance.length > 0) {
            const newBookie = userBalance.find(obj => obj.bookieId === bookieId);
            setCurBookie(newBookie);
        }
    }, [userBalance]);

    const { bookieColors, bookieBorderColors } = useTheme();

    const switchBookie = () => {
        // use userBalance to determine which bookies are available
        // cycle to next id in userBalance, if it doesn't exist, cycle to first
        // curBookie is the bookie object with the current bookieId
        const bookieIds = userBalance.map(obj => obj.bookieId);
        let newBookieId = bookieId + 1;
        if (!bookieIds.includes(newBookieId)) {
            newBookieId = 1;
        }
        const newBookie = userBalance.find(obj => obj.bookieId === newBookieId).bookieName;
        setBookieId(newBookieId);
        setBookie(newBookie);
    };

    return (
        <Pressable 
            style={({pressed}) => ({
                ...styles.bankButton,
                backgroundColor: bookieColors[bookie],
                borderColor: bookieColors[bookie],
                opacity: pressed ? 0.6 : 1,
            })}
            onPress={() => openModal()}
            onLongPress={() => switchBookie()}
        >
          <View style={{ backgroundColor: 'transparent', width: 75, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>${curBookie.balance.toFixed(2)}</Text>
          </View>
            <Image source={bookieImages[bookie]} style={{ width: 32, height: 32, borderRadius: 8 }} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
  bankButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -8,
    paddingLeft: 8,
  },
});