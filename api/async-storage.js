import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to set balance in AsyncStorage
export const fetchBalance = async () => {
    try {
        const defaultBalance = [{ bookie: 'DraftKings', balance: 0 }, { bookie: 'FanDuel', balance: 0 }];
        await AsyncStorage.setItem('balance', JSON.stringify(defaultBalance));
        return defaultBalance;
    } catch (error) {
        console.error('Error setting balance:', error);
        throw error;
    }
};

// Function to retrieve balance from AsyncStorage
export const retrieveBalance = async () => {
    try {
        const balance = await AsyncStorage.getItem('balance');
        if (balance !== null) {
            // We have data!!
            return JSON.parse(balance);
        } else {
            // If there's no data, set the default balance
            await fetchBalance();
            return await retrieveBalance();
        }
    } catch (error) {
        console.error('Error retrieving balance:', error);
        throw error;
    }
};

// Function to update balance in AsyncStorage
export const updateBalance = async (bookie, balance) => {
    try {
        const storedBalance = await retrieveBalance();
        const updatedBalance = storedBalance.map(item => {
            if (item.bookie === bookie) {
                return { ...item, balance: Number(balance) };
            }
            return item;
        });
        await AsyncStorage.setItem('balance', JSON.stringify(updatedBalance));
        console.log('Balance updated:', updatedBalance);
        return updatedBalance;
    } catch (error) {
        console.error('Error updating balance:', error);
        throw error;
    }
};