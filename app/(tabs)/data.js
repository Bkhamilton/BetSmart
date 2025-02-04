import React from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView } from '@/components/Themed';
import DataHeader from '@/components/Data/DataHeader';
import AnalyticsDisplay from '@/components/Data/AnalyticsDisplay';
import useHookData from '@/hooks/useHookData';

export default function DataScreen() {

    const { 
        selectTime, 
        selectedTime,
        data,
        refreshData,
    } = useHookData();

    return (
        <>
            <DataHeader
                selectTime={selectTime}
                selectedTime={selectedTime}
            />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={refreshData}
                    />
                }
            >
                <AnalyticsDisplay data={data}/>
            </ScrollView>
        </>
    );
}