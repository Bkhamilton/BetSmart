// Description: Cloud function to handle the scheduler for the leagues.
import { getSeasonByDate } from '@/db/general/Seasons';
import { getTodaysGameswithNames } from '@/db/general/Games';
import { getActiveLeagues } from "@/db/general/Leagues";

import { getTime, getAmPm } from '@/utils/dateFunctions';

export const handleLeagueSchedule = async (db, league, date) => {
    const season = await getSeasonByDate(db, league.id, date);
    const games = await getTodaysGameswithNames(db, date, season.id);

    let earliestStartTime = null;

    for (const game of games) {
        const gameTime = new Date(game.timestamp);
        if (!earliestStartTime || gameTime < earliestStartTime) {
            earliestStartTime = gameTime;
        }
    }
    return earliestStartTime;
}

export const buildScheduler = async (db) => {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const leagues = await getActiveLeagues(db, date);
    const scheduler = {};
    for (const league of leagues) {
        const leagueSchedule = await handleLeagueSchedule(db, league, date);
        scheduler[league.leagueName] = leagueSchedule;
    }

    return scheduler;
}
