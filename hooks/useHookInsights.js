import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { getWonBetSlipCountLast7Days, getProfitLast7Days, getWinningestBetSlipLast7Days } from '@/db/betslips/BetSlipsResults';
import { getBetSlipsLast7Days } from '@/db/betslips/BetSlips';
import { DBContext } from '@/contexts/DBContext';

const useHookInsightsPage = () => {

    const { db } = useContext(DBContext);

    const { user, signedIn } = useContext(UserContext);
    
    const [streak, setStreak] = useState('hot');

    const [betsPlaced, setBetsPlaced] = useState(0);
    const [betsWon, setBetsWon] = useState(0);
    const [profit, setProfit] = useState(0);
    const [topBet, setTopBet] = useState({});

    // function to cycle betwen hot, cold, and no streaks
    const cycleStreak = () => {
        if (streak === 'hot') {
            setStreak('cold');
        } else if (streak === 'cold') {
            setStreak('');
        } else {
            setStreak('hot');
        }
    }

    useEffect(() => {
        if (!user) return;
        if (signedIn) {
            getBetSlipsLast7Days(db, user.id).then((res) => {
                setBetsPlaced(res);
            });
            getWonBetSlipCountLast7Days(db, user.id).then((res) => {
                setBetsWon(res);
            });
            getProfitLast7Days(db, user.id).then((res) => {
                setProfit(res);
            });
            getWinningestBetSlipLast7Days(db, user.id).then((res) => {
                setTopBet(res);
            });
        } else {
            setBetsPlaced(0);
            setBetsWon(0);
            setProfit(0);
        }
    }, [user, signedIn]);
    
    return {
        streak,
        cycleStreak,
        betsPlaced,
        betsWon,
        profit,
        topBet,
    };
};

export default useHookInsightsPage;