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
        const transaction = await db.getAsync('SELECT * FROM Transactions WHERE id = ?', [transactionId]);
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
