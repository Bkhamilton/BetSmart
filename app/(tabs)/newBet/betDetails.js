import { StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '@/components/Header/Header';
import React from 'react';

export default function BetDetailsScreen() {

  const router = useRouter();

  const handleClose = () => {
    router.pop();
  };

  return (
    <View style={styles.container}>
      <Header title={'Bet Details'}/>
      <View>
        <Text>Bet Details</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profitText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
