import React from 'react';
import { ClearView, Text } from '@/components/Themed';

export default function AltDisplay({ stat }) {
    return (
        <ClearView style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ fontSize: 16 }}>{stat}</Text>
        </ClearView>
    )
}