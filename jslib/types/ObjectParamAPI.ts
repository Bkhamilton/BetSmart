import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { BookMarket } from '../models/BookMarket';
import { FantasyBook } from '../models/FantasyBook';
import { FantasyBookMarket } from '../models/FantasyBookMarket';
import { FantasyBookMultiMarket } from '../models/FantasyBookMultiMarket';
import { FantasyBooks } from '../models/FantasyBooks';
import { FantasyLeagueSnapshot } from '../models/FantasyLeagueSnapshot';
import { FantasySnapshot } from '../models/FantasySnapshot';
import { Game } from '../models/Game';
import { GameInfo } from '../models/GameInfo';
import { GamesInfo } from '../models/GamesInfo';
import { HTTPValidationError } from '../models/HTTPValidationError';
import { Line } from '../models/Line';
import { LocationInner } from '../models/LocationInner';
import { Market } from '../models/Market';
import { Markets } from '../models/Markets';
import { Outcome } from '../models/Outcome';
import { Participant } from '../models/Participant';
import { SportsBook } from '../models/SportsBook';
import { SportsBooks } from '../models/SportsBooks';
import { Usage } from '../models/Usage';
import { ValidationError } from '../models/ValidationError';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiBETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet
     */
    gameId: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet
     */
    market: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApibETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet
     */
    activeOnly?: boolean
    /**
     * 
     * @type Date
     * @memberof DefaultApibETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet
     */
    endDatetime?: Date
}

export interface DefaultApiBETAGetGameBetaGameGameIdGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetGameBetaGameGameIdGet
     */
    gameId: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetGameBetaGameGameIdGet
     */
    apiKey: string
}

export interface DefaultApiBETAGetGamesBetaGamesLeagueGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetGamesBetaGamesLeagueGet
     */
    league: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetGamesBetaGamesLeagueGet
     */
    apiKey: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetGamesBetaGamesLeagueGet
     */
    date: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetGamesBetaGamesLeagueGet
     */
    tz?: string
}

export interface DefaultApiBETAGetMarketsBetaMarketsGameIdGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetMarketsBetaMarketsGameIdGet
     */
    gameId: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetMarketsBetaMarketsGameIdGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApibETAGetMarketsBetaMarketsGameIdGet
     */
    fantasy?: boolean
}

export interface DefaultApiBETAGetOddsBetaOddsGameIdMarketGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetOddsBetaOddsGameIdMarketGet
     */
    gameId: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetOddsBetaOddsGameIdMarketGet
     */
    market: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetOddsBetaOddsGameIdMarketGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApibETAGetOddsBetaOddsGameIdMarketGet
     */
    activeOnly?: boolean
    /**
     * 
     * @type Date
     * @memberof DefaultApibETAGetOddsBetaOddsGameIdMarketGet
     */
    endDatetime?: Date
}

export interface DefaultApiBETAGetPlayerBetaParticipantParticipantIdGetRequest {
    /**
     * 
     * @type number
     * @memberof DefaultApibETAGetPlayerBetaParticipantParticipantIdGet
     */
    participantId: number
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetPlayerBetaParticipantParticipantIdGet
     */
    apiKey: string
}

export interface DefaultApiBETAGetUsageBetaUsageGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETAGetUsageBetaUsageGet
     */
    apiKey: string
}

export interface DefaultApiBETALookupPlayerBetaParticipantLookupGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApibETALookupPlayerBetaParticipantLookupGet
     */
    name: string
    /**
     * 
     * @type string
     * @memberof DefaultApibETALookupPlayerBetaParticipantLookupGet
     */
    apiKey: string
}

export interface DefaultApiV1GetFantasyLinesV1FantasyLinesGameIdMarketGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetFantasyLinesV1FantasyLinesGameIdMarketGet
     */
    gameId: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetFantasyLinesV1FantasyLinesGameIdMarketGet
     */
    market: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetFantasyLinesV1FantasyLinesGameIdMarketGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApiv1GetFantasyLinesV1FantasyLinesGameIdMarketGet
     */
    activeOnly?: boolean
    /**
     * 
     * @type Date
     * @memberof DefaultApiv1GetFantasyLinesV1FantasyLinesGameIdMarketGet
     */
    endDatetime?: Date
}

export interface DefaultApiV1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet
     */
    league: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet
     */
    market: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApiv1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet
     */
    activeOnly?: boolean
}

export interface DefaultApiV1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet
     */
    league: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApiv1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet
     */
    activeOnly?: boolean
}

export interface DefaultApiV1GetOddsV1OddsGameIdMarketGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetOddsV1OddsGameIdMarketGet
     */
    gameId: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetOddsV1OddsGameIdMarketGet
     */
    market: string
    /**
     * 
     * @type string
     * @memberof DefaultApiv1GetOddsV1OddsGameIdMarketGet
     */
    apiKey: string
    /**
     * 
     * @type boolean
     * @memberof DefaultApiv1GetOddsV1OddsGameIdMarketGet
     */
    activeOnly?: boolean
    /**
     * 
     * @type Date
     * @memberof DefaultApiv1GetOddsV1OddsGameIdMarketGet
     */
    endDatetime?: Date
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Beta Get Fantasy Lines
     * @param param the request object
     */
    public bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(param: DefaultApiBETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetRequest, options?: Configuration): Promise<HttpInfo<FantasyBooks>> {
        return this.api.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * Beta Get Fantasy Lines
     * @param param the request object
     */
    public bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(param: DefaultApiBETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetRequest, options?: Configuration): Promise<FantasyBooks> {
        return this.api.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * Beta Get Game
     * @param param the request object
     */
    public bETAGetGameBetaGameGameIdGetWithHttpInfo(param: DefaultApiBETAGetGameBetaGameGameIdGetRequest, options?: Configuration): Promise<HttpInfo<GameInfo>> {
        return this.api.bETAGetGameBetaGameGameIdGetWithHttpInfo(param.gameId, param.apiKey,  options).toPromise();
    }

    /**
     * Beta Get Game
     * @param param the request object
     */
    public bETAGetGameBetaGameGameIdGet(param: DefaultApiBETAGetGameBetaGameGameIdGetRequest, options?: Configuration): Promise<GameInfo> {
        return this.api.bETAGetGameBetaGameGameIdGet(param.gameId, param.apiKey,  options).toPromise();
    }

    /**
     * Beta Get Games
     * @param param the request object
     */
    public bETAGetGamesBetaGamesLeagueGetWithHttpInfo(param: DefaultApiBETAGetGamesBetaGamesLeagueGetRequest, options?: Configuration): Promise<HttpInfo<GamesInfo>> {
        return this.api.bETAGetGamesBetaGamesLeagueGetWithHttpInfo(param.league, param.apiKey, param.date, param.tz,  options).toPromise();
    }

    /**
     * Beta Get Games
     * @param param the request object
     */
    public bETAGetGamesBetaGamesLeagueGet(param: DefaultApiBETAGetGamesBetaGamesLeagueGetRequest, options?: Configuration): Promise<GamesInfo> {
        return this.api.bETAGetGamesBetaGamesLeagueGet(param.league, param.apiKey, param.date, param.tz,  options).toPromise();
    }

    /**
     * Beta Get Markets
     * @param param the request object
     */
    public bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(param: DefaultApiBETAGetMarketsBetaMarketsGameIdGetRequest, options?: Configuration): Promise<HttpInfo<Markets>> {
        return this.api.bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(param.gameId, param.apiKey, param.fantasy,  options).toPromise();
    }

    /**
     * Beta Get Markets
     * @param param the request object
     */
    public bETAGetMarketsBetaMarketsGameIdGet(param: DefaultApiBETAGetMarketsBetaMarketsGameIdGetRequest, options?: Configuration): Promise<Markets> {
        return this.api.bETAGetMarketsBetaMarketsGameIdGet(param.gameId, param.apiKey, param.fantasy,  options).toPromise();
    }

    /**
     * Beta Get Odds
     * @param param the request object
     */
    public bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(param: DefaultApiBETAGetOddsBetaOddsGameIdMarketGetRequest, options?: Configuration): Promise<HttpInfo<SportsBooks>> {
        return this.api.bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * Beta Get Odds
     * @param param the request object
     */
    public bETAGetOddsBetaOddsGameIdMarketGet(param: DefaultApiBETAGetOddsBetaOddsGameIdMarketGetRequest, options?: Configuration): Promise<SportsBooks> {
        return this.api.bETAGetOddsBetaOddsGameIdMarketGet(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * Beta Get Player
     * @param param the request object
     */
    public bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(param: DefaultApiBETAGetPlayerBetaParticipantParticipantIdGetRequest, options?: Configuration): Promise<HttpInfo<Participant>> {
        return this.api.bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(param.participantId, param.apiKey,  options).toPromise();
    }

    /**
     * Beta Get Player
     * @param param the request object
     */
    public bETAGetPlayerBetaParticipantParticipantIdGet(param: DefaultApiBETAGetPlayerBetaParticipantParticipantIdGetRequest, options?: Configuration): Promise<Participant> {
        return this.api.bETAGetPlayerBetaParticipantParticipantIdGet(param.participantId, param.apiKey,  options).toPromise();
    }

    /**
     * Beta Get Usage
     * @param param the request object
     */
    public bETAGetUsageBetaUsageGetWithHttpInfo(param: DefaultApiBETAGetUsageBetaUsageGetRequest, options?: Configuration): Promise<HttpInfo<Usage>> {
        return this.api.bETAGetUsageBetaUsageGetWithHttpInfo(param.apiKey,  options).toPromise();
    }

    /**
     * Beta Get Usage
     * @param param the request object
     */
    public bETAGetUsageBetaUsageGet(param: DefaultApiBETAGetUsageBetaUsageGetRequest, options?: Configuration): Promise<Usage> {
        return this.api.bETAGetUsageBetaUsageGet(param.apiKey,  options).toPromise();
    }

    /**
     * Beta Lookup Player
     * @param param the request object
     */
    public bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(param: DefaultApiBETALookupPlayerBetaParticipantLookupGetRequest, options?: Configuration): Promise<HttpInfo<Participant>> {
        return this.api.bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(param.name, param.apiKey,  options).toPromise();
    }

    /**
     * Beta Lookup Player
     * @param param the request object
     */
    public bETALookupPlayerBetaParticipantLookupGet(param: DefaultApiBETALookupPlayerBetaParticipantLookupGetRequest, options?: Configuration): Promise<Participant> {
        return this.api.bETALookupPlayerBetaParticipantLookupGet(param.name, param.apiKey,  options).toPromise();
    }

    /**
     * V1 Get Fantasy Lines
     * @param param the request object
     */
    public v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(param: DefaultApiV1GetFantasyLinesV1FantasyLinesGameIdMarketGetRequest, options?: Configuration): Promise<HttpInfo<FantasyBooks>> {
        return this.api.v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * V1 Get Fantasy Lines
     * @param param the request object
     */
    public v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(param: DefaultApiV1GetFantasyLinesV1FantasyLinesGameIdMarketGetRequest, options?: Configuration): Promise<FantasyBooks> {
        return this.api.v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param param the request object
     */
    public v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(param: DefaultApiV1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetRequest, options?: Configuration): Promise<HttpInfo<FantasySnapshot>> {
        return this.api.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(param.league, param.market, param.apiKey, param.activeOnly,  options).toPromise();
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param param the request object
     */
    public v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(param: DefaultApiV1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetRequest, options?: Configuration): Promise<FantasySnapshot> {
        return this.api.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(param.league, param.market, param.apiKey, param.activeOnly,  options).toPromise();
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param param the request object
     */
    public v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(param: DefaultApiV1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetRequest, options?: Configuration): Promise<HttpInfo<FantasyLeagueSnapshot>> {
        return this.api.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(param.league, param.apiKey, param.activeOnly,  options).toPromise();
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param param the request object
     */
    public v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(param: DefaultApiV1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetRequest, options?: Configuration): Promise<FantasyLeagueSnapshot> {
        return this.api.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(param.league, param.apiKey, param.activeOnly,  options).toPromise();
    }

    /**
     * V1 Get Odds
     * @param param the request object
     */
    public v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(param: DefaultApiV1GetOddsV1OddsGameIdMarketGetRequest, options?: Configuration): Promise<HttpInfo<SportsBooks>> {
        return this.api.v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

    /**
     * V1 Get Odds
     * @param param the request object
     */
    public v1GetOddsV1OddsGameIdMarketGet(param: DefaultApiV1GetOddsV1OddsGameIdMarketGetRequest, options?: Configuration): Promise<SportsBooks> {
        return this.api.v1GetOddsV1OddsGameIdMarketGet(param.gameId, param.market, param.apiKey, param.activeOnly, param.endDatetime,  options).toPromise();
    }

}
