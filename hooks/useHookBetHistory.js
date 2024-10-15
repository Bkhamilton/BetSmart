import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getOpenBetSlips } from '@/db/betslips/BetSlips';
import { fillBetSlips } from '@/contexts/BetContext/betSlipHelpers';

const useHookBetHistory = () => {

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

    return {
        selectedType,
        betSlips,
        changeType
    };
};

export default useHookBetHistory;