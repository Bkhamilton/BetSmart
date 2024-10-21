import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Header from '@/components/Header/Header';
import { FontAwesome } from '@expo/vector-icons';

export default function InsightHeader({ onPress }) {

    const { iconColor } = useTheme();

    return (
        <Header title={"Insights"}>
            <TouchableOpacity
                onPress={onPress}
                style={{ marginRight: 10 }}
            >
                <FontAwesome name="refresh" size={20} color={iconColor} />
            </TouchableOpacity>
        </Header>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});