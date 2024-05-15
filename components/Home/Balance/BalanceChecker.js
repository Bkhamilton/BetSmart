import React, { useState } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function BalanceChecker({ openTransaction, balance }) {

    const { mainGreen, accentGreen, mainBlue, accentBlue, iconColor } = useTheme();

    const [betIndex, setBetIndex] = useState(0);
    const [bookie, setBookie] = useState('DraftKings');

    const pressUp = () => {
      setBetIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
    };

    const pressDown = () => {
      setBetIndex((prevIndex) => (prevIndex === 2 ? 2 : prevIndex + 1));
    };

    const textStyles = [
      [styles.bigText, styles.mediumText, styles.smallText],
      [styles.mediumText, styles.bigText, styles.mediumText],
      [styles.smallText, styles.mediumText, styles.bigText],
    ];    

    const recentResults = [10.9, -5, 2.3, 15.80, -8.50, 6.7];
    const recentFanDuelResults = [5.9, -3, 1.3, 10.80, -5.50, 3.7];
    const recentDraftKingsResults = [7.9, -4, 2.3, 12.80, -7.50, 5.7];

    // Function to format the value of the recent bet results
    const formatValue = (num) => {
        const sign = num >= 0 ? '+' : '-';
        return `${sign}$${Math.abs(num).toFixed(2)}`;
    };

    const bookieImages = {
        'DraftKings': draftkings,
        'FanDuel': fanduel,
    };

    const selectBookie = () => {
        setBookie((prevBookie) => {
            if (prevBookie === 'DraftKings') {
            return 'FanDuel';
            } else if (prevBookie === 'FanDuel') {
            return 'Total';
            } else {
            return 'DraftKings';
            }
        });
    };

    const selectTransaction = (type) => {
        openTransaction(type, balance, bookie);
    };

    const balanceColor = bookie === 'FanDuel' ? mainBlue : mainGreen;
    const balanceBorderColor = bookie === 'FanDuel' ? accentBlue : mainGreen;
    
    const balanceValue = bookie === 'Total' ? balance?.reduce((total, item) => total + item.Balance, 0) : balance?.find(item => item.Bookie === bookie)?.Balance || 0;


    const BankButtons = () => {
      return (
        <View style={[styles.box, { overflow: 'hidden', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, flex: 0.28, }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent', transform: [{ translateY: 8 }] }}>
            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
              <TouchableOpacity
                onPress={() => selectTransaction('Deposit')}
                style={{ backgroundColor: 'transparent', paddingHorizontal: 10, }}
              >
                <FontAwesome6 name="sack-dollar" size={24} color={iconColor}/>
              </TouchableOpacity>
              <Text style={{ fontSize: 8, opacity: 0.7, fontWeight: '600' }}>Deposit</Text>
            </View>
            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
              <TouchableOpacity 
                onPress={() => selectTransaction('Withdraw')}
                style={{ backgroundColor: 'transparent', paddingHorizontal: 10 }}
              >
                <FontAwesome6 name="hand-holding-dollar" size={24} color={iconColor}/>
              </TouchableOpacity>
              <Text style={{ fontSize: 8, opacity: 0.7, fontWeight: '600' }}>Withdraw</Text>
            </View>
          </View>
          <TouchableOpacity 
            onLongPress={selectBookie}
            style={[styles.dollarContainer, { borderColor: accentGreen, borderWidth: bookie === 'Total' ? 10 : 2 }]}
          >
            {bookie === 'Total' ? (
              <FontAwesome name="dollar" size={60} color={accentGreen}/>
            ) : (
              <Image source={bookieImages[bookie]} style={{ width: 100, height: 100, borderRadius: 50 }}/>
            )}
          </TouchableOpacity>
        </View>
      );
    };

    const RecentTransactions = () => {
      return (
        <View style={[styles.box, { flex: 0.26, }]}>
          <View style={{ alignItems: 'flex-end', paddingRight: 8, backgroundColor: 'transparent' }}>
            <TouchableOpacity 
              style={{ backgroundColor: 'transparent', opacity: betIndex === 0 ? 1 : 0.5 }}
              onPress={pressUp}
            >
              <FontAwesome name="arrow-up" size={18} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ backgroundColor: 'transparent', opacity: betIndex === 2 ? 1 : 0.5 }}
              onPress={pressDown}
            >
              <FontAwesome name="arrow-down" size={18} color="black"/>
            </TouchableOpacity>
          </View>
          <View style={styles.moneyBox}>
            <Text style={textStyles[betIndex][0]}>
              {formatValue(bookie === 'FanDuel' ? recentFanDuelResults[0] : bookie === 'DraftKings' ? recentDraftKingsResults[0] : recentResults[0])}
            </Text>
            <Text style={textStyles[betIndex][1]}>
              {formatValue(bookie === 'FanDuel' ? recentFanDuelResults[1] : bookie === 'DraftKings' ? recentDraftKingsResults[1] : recentResults[1])}
            </Text>
            <Text style={textStyles[betIndex][2]}>
              {formatValue(bookie === 'FanDuel' ? recentFanDuelResults[2] : bookie === 'DraftKings' ? recentDraftKingsResults[2] : recentResults[2])}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Pressable 
        style={({pressed}) => ({
          ...styles.centeredBox,
          backgroundColor: balanceColor,
          borderColor: balanceBorderColor,
          opacity: pressed ? 0.8 : 1,
      })}
      >
        <BankButtons />
        <View style={styles.centerBox}>
            <Text>{bookie.toUpperCase()} BALANCE</Text>
            <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>
              ${balanceValue.toFixed(2)}
            </Text>
        </View>
        <RecentTransactions />
      </Pressable>
    );
  }

const styles = StyleSheet.create({
  centeredBox: {
      flexDirection: 'row',
      alignItems: 'center', 
      marginHorizontal: 10,
      marginTop: 12,
      borderWidth: 1, 
      justifyContent: 'center',
      borderRadius: 8,
  },
  box: {
      backgroundColor: 'transparent'
  },
  centerBox: {
      flex: 0.46,
      paddingTop: 28,
      paddingBottom: 24, 
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  bigMoneyText: {
      fontSize: 32,
      fontWeight: 'bold',
  },
  moneyText: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  dollarContainer: {
      alignItems: 'center', 
      justifyContent: 'center',
      height: 100, 
      width: 100, 
      borderRadius: 55, 
      transform: [{ translateY: 20 }],
      opacity: 0.3,
      backgroundColor: 'transparent',
      zIndex: 1,
  },
  moneyBox: {
      alignItems: 'flex-end', 
      paddingRight: 4, 
      paddingTop: 14, 
      backgroundColor: 'transparent'
  },  
  bigText: {
      opacity: 0.7
  },
  mediumText: {
      fontSize: 12,
      opacity: 0.6
  },
  smallText: {
      fontSize: 10,
      opacity: 0.4
  },
});