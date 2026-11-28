import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { getWonBetSlipCountLast7Days, getProfitLast7Days, getWinningestBetSlipLast7Days } from '@/db/betslips/BetSlipsResults';
import { getBetSlipsLast7Days } from '@/db/betslips/BetSlips';
import { DBContext } from '@/contexts/DBContext';
import { HistorySyncContext } from '@/contexts/HistorySyncContext';

const useHookInsightsPage = () => {

    const { db } = useContext(DBContext);

    const { user, signedIn } = useContext(UserContext);
    const { revision } = useContext(HistorySyncContext);
    
    const [streak, setStreak] = useState('hot');

    const [betsPlaced, setBetsPlaced] = useState(0);
    const [betsWon, setBetsWon] = useState(0);
    const [profit, setProfit] = useState(0);
    const [topBet, setTopBet] = useState({});
    const [dataOwner, setDataOwner] = useState(null);

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
        let active = true;
        if (!user || !signedIn || !db) {
            setBetsPlaced(0);
            setBetsWon(0);
            setProfit(0);
            setTopBet({});
            setDataOwner(null);
            return () => { active = false; };
        }
        Promise.all([
            getBetSlipsLast7Days(db, user.id),
            getWonBetSlipCountLast7Days(db, user.id),
            getProfitLast7Days(db, user.id),
            getWinningestBetSlipLast7Days(db, user.id),
        ]).then(([placed, won, totalProfit, top]) => {
            if (!active) return;
            setBetsPlaced(placed);
            setBetsWon(won);
            setProfit(totalProfit);
            setTopBet(top);
            setDataOwner(user.id);
        }).catch((error) => console.error('Unable to refresh insights:', error));
        return () => { active = false; };
    }, [db, user?.id, signedIn, revision]);
    
    return {
        streak,
        cycleStreak,
        betsPlaced: user && signedIn && dataOwner === user.id ? betsPlaced : 0,
        betsWon: user && signedIn && dataOwner === user.id ? betsWon : 0,
        profit: user && signedIn && dataOwner === user.id ? profit : 0,
        topBet: user && signedIn && dataOwner === user.id ? topBet : {},
    };
};

export default useHookInsightsPage;