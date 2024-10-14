import React, { useState, useEffect } from 'react';
import { ScrollView } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';
import { getOpenBetSlips } from '@/db/betslips/BetSlips';
import BetSlipDisplay from '@/components/Profile/BetHistory/BetSlipDisplay/BetSlipDisplay';
import { fillBetSlips } from '@/contexts/BetContext/betSlipHelpers';
import BetHistoryHeader from '@/components/Profile/BetHistory/BetHistoryHeader';

export default function SettingsScreen() {
    
    const db = useSQLiteContext();

    const [selectedType, setSelectedType] = useState('Open');

    const [betSlips, setBetSlips] = useState([]);

    function changeType(type) {
      setSelectedType(type);
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const betSlips = await getOpenBetSlips(db);
          const betSlipsWithBets = await fillBetSlips(db, betSlips);
          setBetSlips(betSlipsWithBets);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, []);

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