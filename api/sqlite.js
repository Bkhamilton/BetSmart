import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('your_database_name.db');

// Function to fetch the balance for a given Bookie
export const fetchBalance = async (bookie) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT Balance FROM balance WHERE Bookie = ?',
        [bookie],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0].Balance);
          } else {
            resolve(0); // Return 0 if no balance found for the given Bookie
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Function to update the balance for a given Bookie
export const updateBalance = async (bookie, newBalance) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE balance SET Balance = ? WHERE Bookie = ?',
        [newBalance, bookie],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve(`Balance updated for ${bookie}`);
          } else {
            // Insert a new record if no existing record found
            tx.executeSql(
              'INSERT INTO balance (Bookie, Balance) VALUES (?, ?)',
              [bookie, newBalance],
              (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                  resolve(`New balance inserted for ${bookie}`);
                } else {
                  reject('Failed to update or insert balance');
                }
              },
              (_, error) => reject(error)
            );
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};