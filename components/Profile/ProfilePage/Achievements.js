import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function Achievements() {

    const achievements = [
        {
          id: 1,
          name: '1 Bet Won',
          description: 'You won your first bet!',
          achieved: true,
        },
        {
          id: 2,
          name: '10 Bets Won',
          description: 'You won 10 bets!',
          achieved: true,
        },
        {
          id: 3,
          name: '100 Bets Won',
          description: 'You won 100 bets!',
          achieved: false,
        },
        {
          id: 4,
          name: '+200 Bet Won',
          description: 'You won a bet with +200 odds!',
          achieved: false,
        },
        {
          id: 5,
          name: '+500 Bet Won',
          description: 'You won a bet with +500 odds!',
          achieved: false,
        },
        {
          id: 6,
          name: '+1000 Bet Won',
          description: 'You won a bet with +1000 odds!',
          achieved: false,
        },
        {
          id: 7,
          name: '1 Bet Lost',
          description: 'You lost your first bet!',
          achieved: true,
        },
        {
          id: 8,
          name: '10 Bets Lost',
          description: 'You lost 10 bets!',
          achieved: true,
        },
        {
          id: 9,
          name: '100 Bets Lost',
          description: 'You lost 100 bets!',
          achieved: false,
        },
        {
          id: 10,
          name: 'Bet Streak',
          description: 'You won 5 bets in a row!',
          achieved: false,
        },
        // More achievements...
    ];

    const AchievementComponent = ({ achievement }) => (
        <View style={[styles.achievementContainer, { borderWidth: achievement.achieved ? 2 : 1 }]}>
          <Text>{achievement.id}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Achievements</Text>
            </View>
            <ScrollView  
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ paddingVertical: 12, paddingLeft: 20 }}
            >
                {achievements.map((achievement) => (
                    <AchievementComponent key={achievement.id} achievement={achievement} />
                ))}
            </ScrollView>
        </View>
    );
  
}

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 0,
    },
    achievementContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
  });
