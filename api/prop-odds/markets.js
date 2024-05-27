import secrets from "@/secrets";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGamesByDate, insertGame } from "@/db/general/Games";
import { getTeamIds } from "@/db/general/Teams";
import { getCurrentSeason } from "@/db/general/Seasons";
import { getLeagueByName } from "@/db/general/Leagues";
import { getTodaysGameswithNames } from "@/db/general/Games";