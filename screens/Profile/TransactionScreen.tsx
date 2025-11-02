import React from 'react';
import TransactionHeader from '@/components/Profile/TransactionHistory/TransactionHeader';
import TransactionList from '@/components/Profile/TransactionHistory/TransactionList';
import useHookTransactions from '@/hooks/useHookTransactions';

export default function TransactionScreen() {
    
    const { transactions } = useHookTransactions();

    return (
        <>
            <TransactionHeader/>
            <TransactionList
                transactions={transactions}
            />
        </>
    );
}