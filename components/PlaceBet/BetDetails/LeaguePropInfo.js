import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function LeaguePropInfo({ leaguePropInfo }) {

    return (
        <View>
            {leaguePropInfo.map((info, index) => (
                <View key={index} style={styles.container}>
                    <Text style={{ fontSize: 16 }}>{info.propValue}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
});