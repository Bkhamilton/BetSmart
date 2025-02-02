import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getTransactionInfoByUser } from '@/db/user-specific/Transactions';

const useHookTransactions = () => {

    const [transactions, setTransactions] = useState([]);

    const { user, signedIn } = useContext(UserContext);

    const { db } = useContext(DBContext);

    useEffect(() => {
        if (!signedIn) {
            return;
        }
        const fetchTransactions = async () => {
            const transactions = await getTransactionInfoByUser(db, user.id);
            setTransactions(transactions);
        }
        fetchTransactions();
    }, []);

    return {
        transactions
    };
};

export default useHookTransactions;