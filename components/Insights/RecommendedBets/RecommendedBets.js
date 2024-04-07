import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';
import ChooseRecommendedType from './ChooseRecommendedType';
import RecommendedBet from './RecommendedBet';

export default function RecommendedBets({ wins, losses, recent }) {

    const [selectedType, setSelectedType] = useState('Wins');

    return (
        <View>
            <View style={{ paddingHorizontal: 10, paddingTop: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recommended Bets</Text>
                <Text style={{ fontSize: 10 }}>Potential Bets Generated from your recent Betting History</Text>
            </View>
            <ChooseRecommendedType selectType={setSelectedType}/>
            <RecommendedBet type={selectedType} />
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
