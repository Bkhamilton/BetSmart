import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import AccountInfo from '@/components/Profile/Settings/AccountInfo';
import SettingsOptions from '@/components/Profile/Settings/SettingsOptions';
import useRouting from '@/hooks/useRouting';
import useTheme from '@/hooks/useTheme';

export default function SettingsScreen() {

    const { iconColor } = useTheme();

    const { handleProfilePage } = useRouting();

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={handleProfilePage}
          >
            <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>        
        </View>
        <ScrollView>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsHeaderText}>Settings</Text>
          </View>
          <View style={{ backgroundColor: 'transparent' }}>
            <View style={styles.accountHeader}>
              <Text style={styles.accountHeaderText}>Account</Text>
            </View>
            <AccountInfo />
            <SettingsOptions onPress={handleClose}/>
          </View>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  settingsHeader: {
    paddingHorizontal: 20, 
    paddingTop: 48, 
    paddingBottom: 40
  },
  settingsHeaderText: {
    fontSize: 38, 
    fontWeight: 'bold'
  },
  accountHeader: {
    paddingHorizontal: 20, 
    paddingVertical: 12
  },
  accountHeaderText: {
    fontSize: 24, 
    fontWeight: '500'
  },
});
