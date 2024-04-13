import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function ProfileHeader({ user }) {
    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text>100 Bets</Text>
                    <Text>$200 All Time</Text>
                </View>
                <View style={{ paddingVertical: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Name</Text>
                </View>
                <Text style={{ fontSize: 16 }}>Username</Text>
            </View>
            <View style={{ paddingVertical: 12 }}>
                <View style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 1 }}/>
            </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingLeft: 20,
        paddingVertical: 16,
    },
  });
