import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import ProfileMainInfo from '@/components/Profile/ProfilePage/ProfileMainInfo';
import UserFavorites from '@/components/Profile/ProfilePage/UserFavorites';
import Achievements from '@/components/Profile/ProfilePage/Achievements';
import AddBookie from '@/components/Modals/AddBookie';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';
import ActiveBookies from '@/components/Profile/ProfilePage/ActiveBookies';

export default function ProfileScreen() {

  const db = useSQLiteContext();
  
  const { user } = useContext(UserContext);

  const [addBookieModalVisible, setAddBookieModalVisible] = useState(false);

  const openAddBookieModal = () => {
    setAddBookieModalVisible(true);
  }

  const closeAddBookieModal = () => {
    setAddBookieModalVisible(false);
  }

  const router = useRouter();

  const handleSettings = () => {
    router.replace('profile/settings');
  };

  const handleBetHistory = () => {
    router.replace('profile/betHistory');
  };

  const { iconColor, backgroundColor, grayBorder } = useTheme();

  const LoadingHeader = () => {
    return (
      <Header title={'Username'}>
        <TouchableOpacity 
          onPress={handleBetHistory} 
          accessibilityLabel="Open Bet History"
          style={{ marginRight: 4 }}
        >
          <FontAwesome5 name='history' size={24} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSettings}
          accessibilityLabel="Open Settings"
        >
          <FontAwesome name="cog" size={24} color={iconColor}/>
        </TouchableOpacity>
      </Header>
    );
  }

  const ProfilePageHeader = ({ user }) => {
    return (
      <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user.username}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity 
            onPress={handleBetHistory} 
            accessibilityLabel="Open Bet History"
            style={{ marginRight: 4 }}
          >
            <FontAwesome5 name='history' size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSettings}
            accessibilityLabel="Open Settings"
          >
            <FontAwesome name="cog" size={24} color={iconColor}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <>
      {user ? <ProfilePageHeader user={user} /> : <LoadingHeader /> }
      <AddBookie 
        visible={addBookieModalVisible} 
        close={closeAddBookieModal} 
        selectBookie={closeAddBookieModal}  
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => console.log('refreshing')}
          />
        }
      >
        <ProfileMainInfo /> 
        <UserFavorites player={"Zion Williamson"}/>
        <ActiveBookies addBookie={openAddBookieModal}/>
        <Achievements />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {/* Add personal information components here */}
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
  headerContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
