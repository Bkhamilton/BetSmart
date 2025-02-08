// Description: This file contains the functions that are run on startup of the application.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncBookies, syncLeagues, syncSeasons, syncTeams, syncPlayers } from "@/api/supabase/sync";
import { syncLeagueProps, syncLeaguePropsInfo } from "@/api/supabase/sync";
import { syncGames } from "@/api/supabase/sync";
import { syncBetTypes, syncBetTargets, syncBetFormats, syncBetMarkets } from "@/api/supabase/sync";
import { updateGameInfo, updateMarkets } from "@/api/supabase/sync";
import { getAllUpcomingGames } from './Games';
import { getAllUpcomingGames as getAllUpcomingGamesDB } from '@/db/general/Games';
import { getLastUpdatedMarket as getLastUpdatedMarketDB } from '@/db/api/BetMarkets';
import { getLastUpdatedMarket } from './BetMarkets';

export const syncInitialData = async (db, supabase) => {
    // Sync initial data
    await syncUsers(db);
    await syncBookies(db, supabase);
    await syncLeagues(db, supabase);
    await syncSeasons(db, supabase);
    await syncTeams(db, supabase);
    await syncPlayers(db, supabase);
    await syncLeagueProps(db, supabase);
    await syncLeaguePropsInfo(db, supabase);
    await syncGames(db, supabase);
    await syncBetTypes(db, supabase);
    await syncBetTargets(db, supabase);
    await syncBetFormats(db, supabase);
    await syncBetMarkets(db, supabase);
}

export const checkForUpdates2 = async (db, supabase) => {
    // TODO: Implement check for updates logic
    // Check for updates to game info
    // If there are updates, run the updateGameInfo function
    // Check for updates to game results
    // If there are updates, run the resyncGameResults function
    await updateGameInfo(db, supabase);
}

export const checkForUpdates = async (db, supabase) => {
    try {

        const date = new Date();
        const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;    
        const lastSyncDate = await AsyncStorage.getItem('lastSyncDate');

        if (lastSyncDate !== today) {
            // First time opening the app today, run updateGameInfo
            await updateGameInfo(db, supabase);
            await AsyncStorage.setItem('lastSyncDate', today);
        } else {
            // Not the first time opening the app today, check for new data
            console.log('Checking for new data in Supabase');
            const games = await getAllUpcomingGames(supabase);
            const dbGames = await getAllUpcomingGamesDB(db);
            if (games.length === dbGames.length) {
                // There are no games to update
                const lastUpdatedMarket = await getLastUpdatedMarket(supabase);
                const dbLastUpdatedMarket = await getLastUpdatedMarketDB(db);
                // if these markets are within 1 hour of each other, there are no updates
                const time = new Date(lastUpdatedMarket);
                const dbTime = new Date(dbLastUpdatedMarket);
                if (Math.abs(time - dbTime) < 3600) {
                    console.log('No updates to game data');
                } else {
                    console.log('Updates to game data detected');
                    await updateMarkets(db, supabase);
                }
            } else {
                await updateGameInfo(db, supabase);
            }
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
};