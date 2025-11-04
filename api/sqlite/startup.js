import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { createTables } from '@/api/sqlite/createTables';
import { getActiveLeagueNames } from '@/db/general/Leagues';
import { syncInitialData, checkForUpdates } from '@/api/supabase/startup';

// Set up Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY
const supabase = createClient(
    supabaseUrl || "",
    supabaseKey || "",
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);

export const initializeDatabase = async (db) => {
    try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (isFirstLaunch === null) {
            // First-time initialization
            await AsyncStorage.setItem('isFirstLaunch', 'false');
            console.log('First-time initialization');
            await setupDatabase(db);
            await syncInitialData(db, supabase);
        } else {
            console.log('Subsequent loads');
            // Subsequent loads
            await checkForUpdates(db, supabase);
        }
    } catch (error) {
        console.error('Error initializing database:', error.message);
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