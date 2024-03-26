import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '../../components/Header/Header';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header title={'BetSmart'}>
        <FontAwesome name="plus" size={24} color={'black'}/>
      </Header>
      <View style={styles.profileHeader}>
        <Text>Profile Picture</Text>
        <Text style={styles.username}>Username</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {/* Add account settings components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {/* Add personal information components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Betting History</Text>
        {/* Add betting history components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Teams/Leagues</Text>
        {/* Add favorite teams/leagues components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Betting Preferences</Text>
        {/* Add betting preferences components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bankroll Management</Text>
        {/* Add bankroll management components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements/Badges</Text>
        {/* Add achievements/badges components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social</Text>
        {/* Add social features components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        {/* Add privacy settings components here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support/Help</Text>
        {/* Add support/help components here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
