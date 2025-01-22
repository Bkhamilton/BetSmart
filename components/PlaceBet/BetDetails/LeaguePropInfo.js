import React from 'react';
import { StyleSheet } from 'react-native';
import { ClearView, Text } from '@/components/Themed';
import componentMapping from '@/utils/componentMapping';

export default function LeaguePropInfo({ leaguePropInfo }) {
    return (
        <>
            {leaguePropInfo.map((info, index) => {
                const Component = componentMapping[info.propValue];
                if (!Component) return <Text key={index}>{info.propValue}</Text>;
                return (
                    <ClearView key={index} style={styles.container}>
                        <Component info={info}/>
                    </ClearView>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});