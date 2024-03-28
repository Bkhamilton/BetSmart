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
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Beta Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<HttpInfo<FantasyBooks>> {
        const result = this.api.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<FantasyBooks> {
        const result = this.api.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Game
     * @param gameId 
     * @param apiKey 
     */
    public bETAGetGameBetaGameGameIdGetWithHttpInfo(gameId: string, apiKey: string, _options?: Configuration): Promise<HttpInfo<GameInfo>> {
        const result = this.api.bETAGetGameBetaGameGameIdGetWithHttpInfo(gameId, apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Game
     * @param gameId 
     * @param apiKey 
     */
    public bETAGetGameBetaGameGameIdGet(gameId: string, apiKey: string, _options?: Configuration): Promise<GameInfo> {
        const result = this.api.bETAGetGameBetaGameGameIdGet(gameId, apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Games
     * @param league 
     * @param apiKey 
     * @param date 
     * @param tz 
     */
    public bETAGetGamesBetaGamesLeagueGetWithHttpInfo(league: string, apiKey: string, date: string, tz?: string, _options?: Configuration): Promise<HttpInfo<GamesInfo>> {
        const result = this.api.bETAGetGamesBetaGamesLeagueGetWithHttpInfo(league, apiKey, date, tz, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Games
     * @param league 
     * @param apiKey 
     * @param date 
     * @param tz 
     */
    public bETAGetGamesBetaGamesLeagueGet(league: string, apiKey: string, date: string, tz?: string, _options?: Configuration): Promise<GamesInfo> {
        const result = this.api.bETAGetGamesBetaGamesLeagueGet(league, apiKey, date, tz, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Markets
     * @param gameId 
     * @param apiKey 
     * @param fantasy 
     */
    public bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(gameId: string, apiKey: string, fantasy?: boolean, _options?: Configuration): Promise<HttpInfo<Markets>> {
        const result = this.api.bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(gameId, apiKey, fantasy, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Markets
     * @param gameId 
     * @param apiKey 
     * @param fantasy 
     */
    public bETAGetMarketsBetaMarketsGameIdGet(gameId: string, apiKey: string, fantasy?: boolean, _options?: Configuration): Promise<Markets> {
        const result = this.api.bETAGetMarketsBetaMarketsGameIdGet(gameId, apiKey, fantasy, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<HttpInfo<SportsBooks>> {
        const result = this.api.bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetOddsBetaOddsGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<SportsBooks> {
        const result = this.api.bETAGetOddsBetaOddsGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Player
     * @param participantId 
     * @param apiKey 
     */
    public bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(participantId: number, apiKey: string, _options?: Configuration): Promise<HttpInfo<Participant>> {
        const result = this.api.bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(participantId, apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Player
     * @param participantId 
     * @param apiKey 
     */
    public bETAGetPlayerBetaParticipantParticipantIdGet(participantId: number, apiKey: string, _options?: Configuration): Promise<Participant> {
        const result = this.api.bETAGetPlayerBetaParticipantParticipantIdGet(participantId, apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Usage
     * @param apiKey 
     */
    public bETAGetUsageBetaUsageGetWithHttpInfo(apiKey: string, _options?: Configuration): Promise<HttpInfo<Usage>> {
        const result = this.api.bETAGetUsageBetaUsageGetWithHttpInfo(apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Get Usage
     * @param apiKey 
     */
    public bETAGetUsageBetaUsageGet(apiKey: string, _options?: Configuration): Promise<Usage> {
        const result = this.api.bETAGetUsageBetaUsageGet(apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Lookup Player
     * @param name 
     * @param apiKey 
     */
    public bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(name: string, apiKey: string, _options?: Configuration): Promise<HttpInfo<Participant>> {
        const result = this.api.bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(name, apiKey, _options);
        return result.toPromise();
    }

    /**
     * Beta Lookup Player
     * @param name 
     * @param apiKey 
     */
    public bETALookupPlayerBetaParticipantLookupGet(name: string, apiKey: string, _options?: Configuration): Promise<Participant> {
        const result = this.api.bETALookupPlayerBetaParticipantLookupGet(name, apiKey, _options);
        return result.toPromise();
    }

    /**
     * V1 Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<HttpInfo<FantasyBooks>> {
        const result = this.api.v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * V1 Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<FantasyBooks> {
        const result = this.api.v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param league 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(league: string, market: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Promise<HttpInfo<FantasySnapshot>> {
        const result = this.api.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(league, market, apiKey, activeOnly, _options);
        return result.toPromise();
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param league 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league: string, market: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Promise<FantasySnapshot> {
        const result = this.api.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league, market, apiKey, activeOnly, _options);
        return result.toPromise();
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param league 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(league: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Promise<HttpInfo<FantasyLeagueSnapshot>> {
        const result = this.api.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(league, apiKey, activeOnly, _options);
        return result.toPromise();
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param league 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Promise<FantasyLeagueSnapshot> {
        const result = this.api.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league, apiKey, activeOnly, _options);
        return result.toPromise();
    }

    /**
     * V1 Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<HttpInfo<SportsBooks>> {
        const result = this.api.v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }

    /**
     * V1 Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetOddsV1OddsGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<SportsBooks> {
        const result = this.api.v1GetOddsV1OddsGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);
        return result.toPromise();
    }


}



