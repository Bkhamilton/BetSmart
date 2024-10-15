import React from 'react';
import { ScrollView } from '@/components/Themed';
import BetSlipDisplay from '@/components/Profile/BetHistory/BetSlipDisplay/BetSlipDisplay';
import BetHistoryHeader from '@/components/Profile/BetHistory/BetHistoryHeader';
import useHookBetHistory from '@/hooks/useHookBetHistory';

export default function BetHistoryScreen() {
    
    const { selectedType, betSlips, changeType } = useHookBetHistory();

    return (
        <>
            <BetHistoryHeader
                changeType={changeType}
                selectedType={selectedType}
            />
            <ScrollView>
                <BetSlipDisplay
                    betSlips={betSlips}
                    selectedType={selectedType}
                >
                </BetSlipDisplay>
            </ScrollView>
        </>
    );
}