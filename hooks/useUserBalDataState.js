import { useState, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { insertBalance, updateBalance } from '@/db/user-specific/Balance';
import { insertTransaction, getTransactionsByUser } from '@/db/user-specific/Transactions';
import { useSQLiteContext } from 'expo-sqlite';

const useUserBalDataState = () => {
    
    const db = useSQLiteContext();

    const { user, setUserBalance } = useContext(UserContext);

    const [userTransactions, setUserTransactions] = useState([]);

    const addBookie = (bookie) => {
        insertBalance(db, bookie.id, 0, user.id).then(() => {
        setUserBalance(prevBalances => [...prevBalances, { bookieId: bookie.id, bookieName: bookie.name, balance: 0 }]);
        });
    };

    const confirmTransaction = (bookieId, title, initialAmount, transactionAmount, updatedBalance) => {
        updateBalance(db, bookieId, updatedBalance, user.id).then(() => {
            setUserBalance(prevBalances => 
                prevBalances.map(item => 
                item.bookieId === bookieId ? { ...item, balance: Number(updatedBalance) } : item
                )
            );
        });
        const timestamp = new Date().toISOString();
        const description = `${title} for ${transactionAmount} with ${transactionBookie}`;
        insertTransaction(db, bookieId, user.id, title, initialAmount, transactionAmount, updatedBalance, timestamp, description);
        getTransactionsByUser(db, user.id).then((transactions) => {
            setUserTransactions(transactions);
        });
    }

    return {
        addBookie,
        confirmTransaction,
        userTransactions,
        setUserTransactions,
    };
};

export default useUserBalDataState;