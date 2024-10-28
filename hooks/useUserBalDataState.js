import { useState, useContext, useEffect } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { insertBalance, updateBalance, deleteBalance } from '@/db/user-specific/Balance';
import { insertTransaction, getTransactionsByUser } from '@/db/user-specific/Transactions';
import { getMonthlyWithdrawals, getMonthlyDeposits } from '@/db/user-specific/Transactions';

const useUserBalDataState = () => {
    
    const { db } = useContext(DBContext);

    const { user, setUserBalance, signedIn } = useContext(UserContext);

    const [addBookieModalVisible, setAddBookieModalVisible] = useState(false);
    const [transactionModalVisible, setTransactionModalVisible] = useState(false);

    const [transactionTitle, setTransactionTitle] = useState('');
    const [transactionBookie, setTransactionBookie] = useState({});

    const [userTransactions, setUserTransactions] = useState([]);

    const [monthlyDeposits, setMonthlyDeposits] = useState(0);
    const [monthlyWithdrawals, setMonthlyWithdrawals] = useState(0);

    const openAddBookieModal = () => {
        setAddBookieModalVisible(true);
    }

    const closeAddBookieModal = () => {
        setAddBookieModalVisible(false);
    }

    function updateTransactionInfo(title, bookie) {
        setTransactionTitle(title);
        setTransactionBookie(bookie);
    }
    
    function openTransactionModal(type, bookie) {
        updateTransactionInfo(type, bookie);
        setTransactionModalVisible(true);
    }
      
    function closeTransactionModal() {
        setTransactionModalVisible(false);
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

    const onConfirmTransaction = (bookieId, title, initialAmount, transactionAmount, updatedBalance) => {
        confirmTransaction(bookieId, title, initialAmount, transactionAmount, updatedBalance);
        closeTransactionModal();
    }

    useEffect(() => {
        const fetchUserTransactions = async () => {
            if (user && signedIn) {
                const transactions = await getTransactionsByUser(db, user.id);
                setUserTransactions(transactions);
            } else {
                setUserTransactions([]);
            }
        };

        const fetchMonthlyBalanceChanges = async () => {
            if (user && signedIn) {
                const deposits = await getMonthlyDeposits(db, user.id);
                const withdrawals = await getMonthlyWithdrawals(db, user.id);
                setMonthlyDeposits(deposits);
                setMonthlyWithdrawals(withdrawals);
            } else {
                setMonthlyDeposits(0);
                setMonthlyWithdrawals(0);
            }
        };

        fetchUserTransactions();
        fetchMonthlyBalanceChanges();
    }, [db, user, signedIn]);

    return {
        addBookieModalVisible,
        transactionModalVisible,
        transactionTitle,
        transactionBookie,
        userTransactions,
        monthlyDeposits,
        monthlyWithdrawals,
        setUserTransactions,
        openAddBookieModal,
        closeAddBookieModal,
        openTransactionModal,
        closeTransactionModal,
        addBookie,
        deleteBalBookie,
        confirmTransaction,
        onConfirmTransaction,
    };
};

export default useUserBalDataState;