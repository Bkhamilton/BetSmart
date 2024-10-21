import { useState } from 'react';

const useHookData = () => {

    const [selectedTime, setSelectedTime] = useState('7D');
    const [filteredData, setFilteredData] = useState([]);
  
    const selectTime = (timeRange) => {
      setSelectedTime(timeRange);
    };

    return {
        selectTime,
        selectedTime,
    };
};

export default useHookData;