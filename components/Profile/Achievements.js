import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function Achievements({ temp }) {

    const achievements = [
        {
          id: 1,
          name: 'First Achievement',
          description: 'This is the first achievement',
          achieved: false,
        },
        {
          id: 2,
          name: 'Second Achievement',
          description: 'This is the second achievement',
          achieved: true,
        },
        // More achievements...
    ];

    const AchievementComponent = ({ achievement }) => (
        <View>
            <View style={{  }} />
          <Text>{achievement.name}</Text>
          <Text>{achievement.description}</Text>
          {achievement.achieved ? <Text>Achieved</Text> : <Text>Not Achieved</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Favorites</Text>
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
    favoriteContainer: {
        borderWidth: 1,
        borderRadius: 8,
        width: 120,
        height: 160,
        marginRight: 8,
    },
    favoriteText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
  });
