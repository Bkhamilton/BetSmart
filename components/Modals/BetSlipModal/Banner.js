import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function Banner({ title }) {

    const { iconColor, grayBackground, grayBorder } = useTheme();

    const [open, setOpen] = useState(false);

    return (
        <View style={{ paddingVertical: 6, width: '100%' }}>
            <TouchableOpacity 
                style={[styles.propContainer, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                onPress={() => setOpen(!open)}
            >
                <ClearView style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
                    <FontAwesome5 name={open ? "chevron-up" : "chevron-down"} size={16} color={iconColor} />
                </ClearView>
                <ClearView>
                    <Text style={{ fontSize: 16 }}>{title}</Text>
                </ClearView>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    propContainer: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
    },
});