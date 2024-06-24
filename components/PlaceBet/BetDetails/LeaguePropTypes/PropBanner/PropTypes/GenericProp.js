import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { GenericComponent } from './ComponentTypes';

export default function GenericProp() {
    return (
        <>
            <View style={{ paddingHorizontal: 8 }}>
                <GenericComponent title={"Special 1"} odds={'+600'} />
                <GenericComponent title={"Special 2"} odds={'+520'} />
                <GenericComponent title={"Special 3"} odds={'+860'} />
                <GenericComponent title={"Special 4"} odds={'+1000'} />
            </View>
        </>
    )
}