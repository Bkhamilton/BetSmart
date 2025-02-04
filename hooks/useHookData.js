import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getProfitByPeriod, getWonBetSlipCountByPeriod, getWinRateByPeriod, getROIByPeriod, getTotalBetAmountByPeriod } from '@/db/data/data';

const useHookData = () => {

    const [selectedTime, setSelectedTime] = useState('7D');
    const [data, setData] = useState({
        totalProfit: 0,
        wonBetCount: 0,
        winRate: 0,
        roi: 0,
    });

    const { user } = useContext(UserContext);
    const { db } = useContext(DBContext);
  
    const selectTime = (timeRange) => {
        setSelectedTime(timeRange);
    };
    
    const getSQLPeriod = (selectedTime) => {
        switch (selectedTime) {
            case 'All':
                return '-10 year'; // This will include all records
            case '7D':
                return '-7 days';
            case '1M':
                return '-1 month';
            case '3M':
                return '-3 months';
            case '6M':
                return '-6 months';
            case '1Y':
                return '-1 year';
            default:
                return 'start of time'; // Default to include all records
        }
    };

    const fetchData = async () => {
        try {
            const period = getSQLPeriod(selectedTime);
            const profit = await getProfitByPeriod(db, user.id, period);
            const wonCount = await getWonBetSlipCountByPeriod(db, user.id, period);
            const rate = await getWinRateByPeriod(db, user.id, period);
            const roi = await getROIByPeriod(db, user.id, period);
            const totalBetAmount = await getTotalBetAmountByPeriod(db, user.id, period);
            setData({
                totalProfit: profit,
                wonBetCount: wonCount,
                winRate: rate,
                roi: roi,
                totalBetAmount: totalBetAmount,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTime]);

    const refreshData = () => {
        fetchData();
    };

    return {
        selectTime,
        selectedTime,
        data,
        refreshData,
    };
};

export default useHookData;