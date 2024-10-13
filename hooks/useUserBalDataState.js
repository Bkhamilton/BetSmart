import { useState, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { insertBalance, updateBalance, deleteBalance } from '@/db/user-specific/Balance';
import { insertTransaction, getTransactionsByUser } from '@/db/user-specific/Transactions';
import { useSQLiteContext } from 'expo-sqlite';

const useUserBalDataState = () => {
    
    const db = useSQLiteContext();

    const { user, setUserBalance } = useContext(UserContext);

    const [addBookieModalVisible, setAddBookieModalVisible] = useState(false);

    const [userTransactions, setUserTransactions] = useState([]);

    const openAddBookieModal = () => {
        setAddBookieModalVisible(true);
    }

    const closeAddBookieModal = () => {
        setAddBookieModalVisible(false);
    }

    const addBookie = (bookie) => {
        insertBalance(db, bookie.id, 0, user.id).then(() => {
        setUserBalance(prevBalances => [...prevBalances, { bookieId: bookie.id, bookieName: bookie.name, balance: 0 }]);
        });
    };

    const deleteBalBookie = (bookieId, userId) => {
        deleteBalance(db, bookieId, userId);
        setUserBalance(prevBalances => prevBalances.filter(item => item.bookieId !== bookieId));
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
        addBookieModalVisible,
        openAddBookieModal,
        closeAddBookieModal,
        addBookie,
        deleteBalBookie,
        confirmTransaction,
        userTransactions,
        setUserTransactions,
    };
};

export default useUserBalDataState;