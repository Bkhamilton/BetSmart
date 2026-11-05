import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/services/supabase';
import { createTables } from '@/api/sqlite/createTables';
import { syncInitialData, checkForUpdates } from '@/api/supabase/startup';

// Always create missing local schema without deleting existing betting history.
export const initializeDatabase = async (db) => {
    await createTables(db);
    if (!supabase) {
        console.info('Supabase is not configured. Starting with local data only.');
        return;
    }

    try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (isFirstLaunch === null) {
            await syncInitialData(db, supabase);
            await AsyncStorage.setItem('isFirstLaunch', 'false');
        } else {
            await checkForUpdates(db, supabase);
        }
    } catch (error) {
        console.warn('Remote sync unavailable; using local data:', error);
    }
};

export const setupDatabase = async (db) => {
    await dropTables(db);
    await dropViews(db);
    await createTables(db);
}

// Function to drop the tables

export const dropTables = async (db) => {
    await db.execAsync(`
        DROP TABLE IF EXISTS Bookies;
        DROP TABLE IF EXISTS Leagues;
        DROP TABLE IF EXISTS Teams;
        DROP TABLE IF EXISTS Seasons;
        DROP TABLE IF EXISTS Games;
        DROP TABLE IF EXISTS Players;
        DROP TABLE IF EXISTS Users;
        DROP TABLE IF EXISTS UserSessions;
        DROP TABLE IF EXISTS Balance;
        DROP TABLE IF EXISTS Transactions;
        DROP TABLE IF EXISTS Bonuses;
        DROP TABLE IF EXISTS Preferences;
        DROP TABLE IF EXISTS LeagueProps;
        DROP TABLE IF EXISTS LeaguePropsInfo;
        DROP TABLE IF EXISTS BetTargets;
        DROP TABLE IF EXISTS BetTypes;
        DROP TABLE IF EXISTS BetFormats;
        DROP TABLE IF EXISTS BetSlips;
        DROP TABLE IF EXISTS ParticipantBets;
        DROP TABLE IF EXISTS Legs;
        DROP TABLE IF EXISTS BetSlipsResults;
        DROP TABLE IF EXISTS ParticipantBetsResults;
        DROP TABLE IF EXISTS LegsResults;
        DROP TABLE IF EXISTS BetMarkets;
        DROP TABLE IF EXISTS FetchHistory;
        DROP TABLE IF EXISTS MarketFetchHistory;
        DROP TABLE IF EXISTS GameResults;
    `);
    console.log('Tables dropped');
};

export const dropViews = async (db) => {
    await db.execAsync(`
        DROP VIEW IF EXISTS OverallBettingPerformance;
        DROP VIEW IF EXISTS LeaguePerformance;
        DROP VIEW IF EXISTS MarketPerformance;
        DROP VIEW IF EXISTS BetTypePerformance;
        DROP VIEW IF EXISTS OddsRangePerformance;
        DROP VIEW IF EXISTS DayOfWeekPerformance;
        DROP VIEW IF EXISTS TimeOfDayPerformance;
        DROP VIEW IF EXISTS BetSizePerformance;
        DROP VIEW IF EXISTS BetFormatPerformance;
        DROP VIEW IF EXISTS BookiePerformance;
    `);
    console.log('Views dropped');
};