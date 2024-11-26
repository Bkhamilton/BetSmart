import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import secrets from "@/secrets";
import { syncBookies, syncLeagues, syncSeasons, syncTeams, syncPlayers } from "@/api/supabase/sync";
import { syncLeagueProps, syncLeaguePropsInfo } from "@/api/supabase/sync";
import { syncGames } from "@/api/supabase/sync";
import { syncBetTypes, syncBetTargets, syncBetFormats, syncBetMarkets } from "@/api/supabase/sync";
import { updateGameInfo } from "@/api/supabase/update";

export const syncInitialData = async (db, supabase) => {
    // Sync initial data
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

export const checkForUpdates = async (db, supabase) => {
    // Check for updates
    await updateGameInfo(db, supabase);
}