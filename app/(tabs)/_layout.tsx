import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Redirect, useSegments } from 'expo-router';
import { ActivityIndicator, TouchableOpacity, type ColorValue } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { View } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { useContext } from 'react';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color?: ColorValue;
}) {
    return <FontAwesome name={props.name} size={28} style={{ marginBottom: -3, color: props.color }} />;
}

interface TabBarButtonProps {
    name: any; 
    active: boolean;
}

function TabBarButton({ name, active }: TabBarButtonProps) {

    const { grayBorder, grayBackground, iconColor, borderColor } = useTheme();

    return (
        <Link href='/(tabs)/newBet/selectGame' asChild>
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
    const { user, signedIn, authLoading } = useContext(UserContext);
    const segments = useSegments();
    const authRoute = segments[segments.length - 1] === 'login' || segments[segments.length - 1] === 'signup';

    if (authLoading) return <ActivityIndicator accessibilityLabel="Restoring account session" style={{ flex: 1 }} size="large" />;
    if (!signedIn && !authRoute) return <Redirect href="/(tabs)/(index)/login" />;
    if (signedIn && authRoute) return <Redirect href="/(tabs)/(index)" />;

    return (
        <Tabs key={user?.cloudUserId ?? 'signed-out'}
            screenOptions={{
                tabBarActiveTintColor: tint,
                tabBarStyle: { backgroundColor: tabBar, borderTopWidth: 1, borderColor: grayBorder },
            }}
        >
            <Tabs.Screen
                name="(index)"
                options={{
                    title: 'BetSmart',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color ?? undefined} />,
                    tabBarLabel: 'Home',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    href: '/(tabs)/insights',
                    tabBarIcon: ({ color }) => <TabBarIcon name="eye" color={color ?? undefined} />,
                    tabBarLabel: 'Insights',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="newBet"
                options={{
                    title: 'New Bet',
                    tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color ?? undefined} />,
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
                    tabBarIcon: ({ color }) => <TabBarIcon name="pie-chart" color={color ?? undefined} />,
                    tabBarLabel: 'Data',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    href: '/(tabs)/profile/profilePage',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color ?? undefined} />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}