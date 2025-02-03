import React from 'react';
import { ScrollView } from '@/components/Themed';
import DataHeader from '@/components/Data/DataHeader';
import AnalyticsDisplay from '@/components/Data/AnalyticsDisplay';
import useHookData from '@/hooks/useHookData';

export default function DataScreen() {

    const { 
        selectTime, 
        selectedTime,
        data,
    } = useHookData();

    return (
        <>
            <DataHeader
                selectTime={selectTime}
                selectedTime={selectedTime}
            />
            <ScrollView>
                <AnalyticsDisplay data={data}/>
            </ScrollView>
        </>
    );
}