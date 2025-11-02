import React from 'react';
import BetHistoryHeader from '@/components/Profile/BetHistory/BetHistoryHeader';
import useHookBetHistory from '@/hooks/useHookBetHistory';
import BetSlipList from '@/components/Profile/BetHistory/BetSlipList';

export default function BetHistoryScreen() {
    
    const { selectedType, betSlips, changeType } = useHookBetHistory();

    return (
        <>
            <BetHistoryHeader
                changeType={changeType}
                selectedType={selectedType}
            />
            <BetSlipList
                betSlips={betSlips}
            />
        </>
    );
}