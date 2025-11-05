import React from 'react';
import { TouchableOpacity, Text, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

export default function ViewToggle({ selectedView, onViewChange }) {
    const { mainGreen, grayBackground, text, grayText } = useTheme();

    return (
        <ClearView style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    selectedView === 'analysis' && { backgroundColor: mainGreen }
                ]}
                onPress={() => onViewChange('analysis')}
            >
                <Text style={[
                    styles.buttonText,
                    selectedView === 'analysis' ? styles.activeText : { color: grayText }
                ]}>
                    Analysis
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.button,
                    selectedView === 'tips' && { backgroundColor: mainGreen }
                ]}
                onPress={() => onViewChange('tips')}
            >
                <Text style={[
                    styles.buttonText,
                    selectedView === 'tips' ? styles.activeText : { color: grayText }
                ]}>
                    Tips
                </Text>
            </TouchableOpacity>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginHorizontal: 6,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeText: {
        color: '#fff',
    },
});
