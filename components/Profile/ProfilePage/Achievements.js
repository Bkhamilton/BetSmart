import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';
import { achievements } from '@/data/achievements';

export default function Achievements() {

    const AchievementComponent = ({ achievement }) => (
        <View style={[styles.achievementContainer, { borderWidth: achievement.achieved ? 4 : 1 }]}>
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
