import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';
import { myBetList } from '../../../data/exampleBetData';
import Colors from '@/constants/Colors';
import ChooseBetType from './ChooseBetType';
import BetDisplay from './BetDisplay';
import TodaysBets from './TodaysBets';
import SettledBets from './SettledBets';
import FutureBets from './FutureBets';

export default function BetView({ bets }) {

    const [selectedType, setSelectedType] = useState('Today');

    const [header, setHeader] = useState('Today\'s Bets');
    const [subheader, setSubheader] = useState('A look at your bets for today');

    function changeHeader(type) {
        const headers = {
            'Today': {
                header: 'Today\'s Bets',
                subheader: 'A look at your bets for today'
            },
            'Settled': {
                header: 'Settled Bets',
                subheader: 'A look at your settled bets'
            },
            'Future': {
                header: 'Future Bets',
                subheader: 'A look at your future bets'
            },
        };
    
        const { header = 'Today\'s Bets', subheader = 'A look at your bets for today' } = headers[type] || {};
    
        setHeader(header);
        setSubheader(subheader);
    }

    function changeType(type) {
        setSelectedType(type);
        changeHeader(type);
    }

    const components = {
        'Today': TodaysBets,
        'Settled': SettledBets,
        'Future': FutureBets,
    };
    
    const BetComponent = components[selectedType] || TodaysBets;

    return (
        <View>
            <View style={{ paddingHorizontal: 10, paddingTop: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{header}</Text>
                <Text style={{ fontSize: 10 }}>{subheader}</Text>
            </View>
            <ChooseBetType selectType={changeType} type={selectedType}/>
            <BetComponent bets={myBetList} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
