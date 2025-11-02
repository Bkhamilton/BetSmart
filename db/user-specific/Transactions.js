import * as SQLite from 'expo-sqlite';

// Function to get all transactions
export const getAllTransactions = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Transactions');
        return allRows;
    } catch (error) {
        console.error('Error retrieving all transactions:', error);
        throw error;
    }
};

// Function to get a transaction
export const getTransaction = async (db, transactionId) => {
    try {
        const transaction = await db.getAllAsync('SELECT * FROM Transactions WHERE id = ?', [transactionId]);
        return transaction;
    } catch (error) {
        console.error('Error retrieving transaction:', error);
        throw error;
    }
};

// Function to get all transactions for a specific bookie
export const getTransactionsByBookie = async (db, bookieId) => {
    try {
        const transactions = await db.getAllAsync('SELECT * FROM Transactions WHERE bookieId = ?', [bookieId]);
        return transactions;
    } catch (error) {
        console.error('Error retrieving transactions by bookie:', error);
        throw error;
    }
};

// Function to get all transactions for a specific user
export const getTransactionsByUser = async (db, userId) => {
    try {
        const transactions = await db.getAllAsync('SELECT * FROM Transactions WHERE userId = ?', [userId]);
        return transactions;
    } catch (error) {
        console.error('Error retrieving transactions by user:', error);
        throw error;
    }
};

// Function to get all transactions for a specific user including bookie name
export const getTransactionInfoByUser = async (db, userId) => {
    try {
        const transactions = await db.getAllAsync(`
            SELECT 
                Transactions.*, 
                Bookies.name as bookieName 
            FROM 
                Transactions 
            JOIN 
                Bookies 
            ON 
                Transactions.bookieId = Bookies.id 
            WHERE 
                Transactions.userId = ?
            ORDER BY
                Transactions.timestamp DESC
            LIMIT 100    
            `, [userId]);
        return transactions;
    } catch (error) {
        console.error('Error retrieving transactions by user with bookie:', error);
        throw error;
    }
};

// Function to get all info related to deposits in the last 7 days for a given user
export const getAllWeeklyDeposits = async (db, userId) => {
    try {
        const weeklyDeposits = await db.getAllAsync('SELECT * FROM Transactions WHERE userId = ? AND transactionType = "Deposit" AND timestamp >= datetime("now", "-7 days")', [userId]);
        return weeklyDeposits;
    } catch (error) {
        console.error('Error retrieving weekly deposits:', error);
        throw error;
    }
};


// Function to get total amount of money deposited in the last 7 days for a given user
export const getWeeklyDeposits = async (db, userId) => {
    try {
        const weeklyDeposits = await db.getAllAsync('SELECT SUM(amount) as total FROM Transactions WHERE userId = ? AND transactionType = "Deposit" AND timestamp >= datetime("now", "-7 days")', [userId]);
        return weeklyDeposits[0].total;
    } catch (error) {
        console.error('Error retrieving weekly deposits:', error);
        throw error;
    }
};

// Function to get total amount of money withdrawn in the last 7 days for a given user
export const getWeeklyWithdrawals = async (db, userId) => {
    try {
        const weeklyWithdrawals = await db.getAllAsync('SELECT SUM(amount) as total FROM Transactions WHERE userId = ? AND transactionType = "Withdraw" AND timestamp >= datetime("now", "-7 days")', [userId]);
        return weeklyWithdrawals[0].total;
    } catch (error) {
        console.error('Error retrieving weekly withdrawals:', error);
        throw error;
    }
};

// Function to get all info related to deposits in the last month for a given user
export const getAllMonthlyDeposits = async (db, userId) => {
    try {
        const monthlyDeposits = await db.getAllAsync('SELECT * FROM Transactions WHERE userId = ? AND transactionType = "Deposit" AND timestamp >= datetime("now", "-30 days")', [userId]);
        return monthlyDeposits;
    } catch (error) {
        console.error('Error retrieving monthly deposits:', error);
        throw error;
    }
};

// Function to get all info related to withdrawals in the last month for a given user
export const getAllMonthlyWithdrawals = async (db, userId) => {
    try {
        const monthlyWithdrawals = await db.getAllAsync('SELECT * FROM Transactions WHERE userId = ? AND transactionType = "Withdraw" AND timestamp >= datetime("now", "-30 days")', [userId]);
        return monthlyWithdrawals;
    } catch (error) {
        console.error('Error retrieving monthly withdrawals:', error);
        throw error;
    }
};

// Function to get total amount of money deposited in the last month for a given user
export const getMonthlyDeposits = async (db, userId) => {
    try {
        const monthlyDeposits = await db.getAllAsync(
            'SELECT COALESCE(SUM(amount), 0) as total FROM Transactions WHERE userId = ? AND transactionType = "Deposit" AND timestamp >= datetime("now", "-30 days")',
            [userId]
        );
        return monthlyDeposits[0].total;
    } catch (error) {
        console.error('Error retrieving monthly deposits:', error);
        throw error;
    }
};

// Function to get total amount of money withdrawn in the last month for a given user
export const getMonthlyWithdrawals = async (db, userId) => {
    try {
        const monthlyWithdrawals = await db.getAllAsync(
            'SELECT COALESCE(SUM(amount), 0) as total FROM Transactions WHERE userId = ? AND transactionType = "Withdraw" AND timestamp >= datetime("now", "-30 days")',
            [userId]
        );
        return monthlyWithdrawals[0].total;
    } catch (error) {
        console.error('Error retrieving monthly withdrawals:', error);
        throw error;
    }
};

// Function to get bookie activity (transaction count and net amount) for the last 30 days
export const getMonthlyBookieActivity = async (db, userId) => {
    try {
        const bookieActivity = await db.getAllAsync(`
            SELECT 
                Transactions.bookieId,
                Bookies.name as bookieName,
                COUNT(*) as transactionCount,
                COALESCE(SUM(CASE WHEN transactionType = 'Deposit' THEN amount ELSE 0 END), 0) as totalDeposits,
                COALESCE(SUM(CASE WHEN transactionType = 'Withdraw' THEN amount ELSE 0 END), 0) as totalWithdrawals,
                COALESCE(SUM(CASE WHEN transactionType = 'Deposit' THEN amount ELSE 0 END), 0) - 
                COALESCE(SUM(CASE WHEN transactionType = 'Withdraw' THEN amount ELSE 0 END), 0) as netAmount
            FROM 
                Transactions
            JOIN 
                Bookies 
            ON 
                Transactions.bookieId = Bookies.id
            WHERE 
                Transactions.userId = ? 
                AND Transactions.timestamp >= datetime("now", "-30 days")
            GROUP BY 
                Transactions.bookieId, Bookies.name
            ORDER BY 
                transactionCount DESC
            LIMIT 1
        `, [userId]);
        return bookieActivity.length > 0 ? bookieActivity[0] : null;
    } catch (error) {
        console.error('Error retrieving monthly bookie activity:', error);
        throw error;
    }
};

// Function to get all deposit transactions
export const getDepositTransactions = async (db) => {
    try {
        const transactions = await db.getAllAsync('SELECT * FROM Transactions WHERE transactionType = "Deposit"');
        return transactions;
    } catch (error) {
        console.error('Error retrieving deposit transactions:', error);
        throw error;
    }
};

// Function to get all withdrawal transactions
export const getWithdrawalTransactions = async (db) => {
    try {
        const transactions = await db.getAllAsync('SELECT * FROM Transactions WHERE transactionType = "Withdrawal"');
        return transactions;
    } catch (error) {
        console.error('Error retrieving withdrawal transactions:', error);
        throw error;
    }
};

// Function to insert a transaction
export const insertTransaction = async (db, bookieId, userId, transactionType, initialBalance, amount, finalBalance, timestamp, description) => {
    try {
        const resultDB = await db.runAsync('INSERT INTO Transactions (bookieId, userId, transactionType, initialBalance, amount, finalBalance, timestamp, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [bookieId, userId, transactionType, initialBalance, amount, finalBalance, timestamp, description]);
        return resultDB.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting transaction:', error);
        throw error;
    }
};

// Function to update a transaction
export const updateTransaction = async (db, transactionId, bookieId, userId, transactionType, initialBalance, amount, finalBalance, timestamp, description) => {
    try {
        await db.runAsync('UPDATE Transactions SET bookieId = ?, userId = ?, transactionType = ?, initialBalance = ?, amount = ?, finalBalance = ?, timestamp = ?, description = ? WHERE id = ?', [bookieId, userId, transactionType, initialBalance, amount, finalBalance, timestamp, description, transactionId]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};

// Function to delete a transaction
export const deleteTransaction = async (db, transactionId) => {
    try {
        await db.runAsync('DELETE FROM Transactions WHERE id = ?', [transactionId]);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};
