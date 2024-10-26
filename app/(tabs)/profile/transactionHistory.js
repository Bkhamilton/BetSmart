import React from 'react';
import { ScrollView, View, Text } from '@/components/Themed';
import TransactionHeader from '@/components/Profile/TransactionHistory/TransactionHeader';

export default function TransactionHistoryScreen() {
    

    return (
        <>
            <TransactionHeader/>
            <ScrollView>
                <Text>Bingle Bangle</Text>
            </ScrollView>
        </>
    );
}