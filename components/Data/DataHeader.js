import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from '@/components/Themed';
import Header from '../../components/Header/Header';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import TimeSelector from './TimeSelector';

export default function DataHeader({ selectTime, selectedTime }) {

    const { iconColor, backgroundColor } = useTheme();

    return (
        <>
            <Header title={"Analytics"}>
                <TouchableOpacity
                    onPress={() => {}}
                    style={{ marginRight: 10 }}
                >
                    <Ionicons name="filter" size={20} color={backgroundColor} />
                </TouchableOpacity>
            </Header>
            <TimeSelector selectTime={selectTime} curTime={selectedTime}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterButton: {
        backgroundColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
});