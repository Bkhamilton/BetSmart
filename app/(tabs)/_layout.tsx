import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { View } from '@/components/Themed';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

interface TabBarButtonProps {
    name: any; 
    active: boolean;
}

function TabBarButton({ name, active }: TabBarButtonProps) {

    const { grayBorder, grayBackground, iconColor, borderColor } = useTheme();

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
                    backgroundColor: grayBackground,
                    borderWidth: 1,
                    borderColor: borderColor,
                }}
            >
                <FontAwesome name={name} size={24} color={iconColor}/>
            </TouchableOpacity>
        </Link>
    );
}

export default function TabLayout() {

    const { grayBorder, tint, tabBar } = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: tint,
                tabBarStyle: { backgroundColor: tabBar, borderTopWidth: 1, borderColor: grayBorder },
            }}
        >
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
                        <View style={{ alignItems: 'center' }}>
                            <TabBarButton 
                                name="plus"
                                active={true}            
                            />
                        </View>
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