import { useState, useEffect, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { getOpenBetSlips } from '@/db/betslips/BetSlips';
import { getSettledBetSlips } from '@/db/betslips/BetSlipsResults';
import { fillBetSlips, fillBetSlipsWithResults } from '@/contexts/NewBetContext/BetContext/betSlipHelpers';

const useHookBetHistory = () => {

    const { db } = useContext(DBContext);

    const { user } = useContext(UserContext);

    const [selectedType, setSelectedType] = useState('Open');

    const [betSlips, setBetSlips] = useState([]);

    function changeType(type) {
        setSelectedType(type);
    }

    const fetchOpenbets = async () => {
        try {
            const betSlips = await getOpenBetSlips(db, user.id);
            const betSlipsWithBets = await fillBetSlips(db, betSlips);
            setBetSlips(betSlipsWithBets);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchSettledBets = async () => {
        try {
            const betSlips = await getSettledBetSlips(db, user.id);
            const betSlipsWithBets = await fillBetSlipsWithResults(db, betSlips);
            setBetSlips(betSlipsWithBets);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (selectedType === 'Open') {
            fetchOpenbets();
        } else {
            fetchSettledBets();
        }
    }, [selectedType]);

    return {
        selectedType,
        betSlips,
        changeType
    };
};

export default useHookBetHistory;