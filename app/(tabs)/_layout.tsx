import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

interface TabBarButtonProps {
  name: any; 
  active: boolean;
  colorScheme: any;
}

function TabBarButton({ name, active, colorScheme }: TabBarButtonProps) {
  return (
    <Link href='/(tabs)/newBet' asChild>
          <TouchableOpacity
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 12,
            elevation: 5,  
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: Colors[colorScheme ?? 'light'].borderColor,
          }}
        >
          <FontAwesome name="plus" size={24} color={'black'}/>
          </TouchableOpacity>
    </Link>

  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarItemStyle: {borderTopWidth: 1, borderColor: Colors[colorScheme ?? 'light'].colorBackground}
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'BetSmart',
          href: '/(tabs)/',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          href: '/(tabs)/insights',
          tabBarIcon: ({ color }) => <TabBarIcon name="eye" color={color} />,
          tabBarLabel: 'Insights',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="newBet"
        options={{
          title: 'New Bet',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          tabBarButton: (props) => (
            <TabBarButton 
              name="plus"
              active={true}
              colorScheme={colorScheme}            
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: 'Data',
          href: '/(tabs)/data',
          tabBarIcon: ({ color }) => <TabBarIcon name="pie-chart" color={color} />,
          tabBarLabel: 'Data',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: '/(tabs)/profile/profilePage',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
