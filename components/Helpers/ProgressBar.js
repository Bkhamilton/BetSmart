import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function ProgressBar({ segments, unallocatedPercentage }) {

    const { iconColor, grayBorder, grayBackground } = useTheme();

    return (
        <View style={[styles.progressBarContainer, { backgroundColor: grayBackground }]}>
            {segments.map((segment, index) => (
                <View
                    key={index}
                    style={[
                        styles.progressSegment,
                        { width: `${segment.percentage}%`, backgroundColor: segment.color },
                    ]}
                />
            ))}
            <View
                style={[
                    styles.progressSegment,
                    { width: `${unallocatedPercentage}%`, backgroundColor: grayBorder },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    progressBarContainer: {
        height: 20,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressSegment: {
        height: '100%',
    },
});