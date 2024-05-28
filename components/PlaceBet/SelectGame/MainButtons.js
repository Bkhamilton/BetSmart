import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function MainButtons({ sports, onPress, leagues }) {

    const { iconColor } = useTheme();

    return (
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer]}
                        onPress={() => onPress(sports[0])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[0].leagueName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer, { marginTop: 0}]}
                        onPress={() => onPress(sports[1])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[1].leagueName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer]}
                        onPress={() => onPress(sports[2])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[2].leagueName}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer, { marginLeft: 4, marginRight: 28}]}
                        onPress={() => onPress(sports[3])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[3].leagueName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mainButtonContainer}
                    >
                        <FontAwesome name="plus" size={24} color={iconColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer, { marginLeft: 28, marginRight: 4}]}
                        onPress={() => onPress(sports[4])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[4].leagueName}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer]}
                        onPress={() => onPress(sports[5])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[5].leagueName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer, { marginTop: 32}]}
                        onPress={() => onPress(sports[6])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[6].leagueName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.mainButtonContainer]}
                        onPress={() => onPress(sports[7])}
                    >
                        <Text style={styles.mainButtonText}>{leagues[7].leagueName}</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flex: 1,
        width: '100%',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    mainButtonContainer: {
        borderWidth: 1,
        borderRadius: 16,
        height: 90,
        width: 90,
        marginHorizontal: 16,
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
