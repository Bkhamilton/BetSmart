import React, { useState, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function Disclosure({ title, content }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const height = useRef(new Animated.Value(0)).current;

    const { grayBackground } = useTheme();

    const toggleDisclosure = () => {
        setIsCollapsed(!isCollapsed);
        Animated.timing(height, {
            toValue: isCollapsed ? 100 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.disclosureButton, grayBackground]} 
                onPress={toggleDisclosure}
            >
                <Text>{title}</Text>
            </TouchableOpacity>
            <Animated.View style={{ height }}>
                <View style={styles.contentContainer}>
                    <Text>{content}</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclosureButton: {
        padding: 16,
        borderRadius: 8,
    },
    contentContainer: {
        padding: 4,
    },
});