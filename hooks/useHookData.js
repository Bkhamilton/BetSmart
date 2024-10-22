import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';

const useHookData = () => {

    const [selectedTime, setSelectedTime] = useState('7D');
    const [filteredData, setFilteredData] = useState([]);
  
    const selectTime = (timeRange) => {
      setSelectedTime(timeRange);
    };

    /*

    const getFilteredData = async (timeRange) => {
      switch (timeRange) {
        case '1D':
          return await get1DData();
        case '7D':
          return await get7DData();
        case '1M':
          return await get1MData();
        case '3M':
          return await get3MData();
        case '1Y':
          return await get1YData();
        default:
          return await getAllData();
      }
    }

    useEffect(() => {
      // Filter data based on selectedTime
      // const filteredData = await getFilteredData(selectedTime);
      // setFilteredData(filteredData);
    }, [selectedTime]);

    */

    return {
        selectTime,
        selectedTime,
    };
};

export default useHookData;