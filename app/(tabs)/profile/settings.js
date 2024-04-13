import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import ProfileHeader from '@/components/Profile/ProfileHeader';

export default function SettingsScreen() {

    const router = useRouter();

    const handleClose = () => {
      router.navigate('profile/profilePage');
    };

    return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <View style={{ flex: 0.2 }}>
                <TouchableOpacity onPress={handleClose}>
                    <FontAwesome5 name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
            </View>
            <View style={{ flex: 0.2, alignItems: 'center' }}>
                
            </View>                
        </View>
        <View>
            <Text>Settings Page</Text>
        </View>
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
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
