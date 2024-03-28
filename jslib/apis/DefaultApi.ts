// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { FantasyBooks } from '../models/FantasyBooks';
import { FantasyLeagueSnapshot } from '../models/FantasyLeagueSnapshot';
import { FantasySnapshot } from '../models/FantasySnapshot';
import { GameInfo } from '../models/GameInfo';
import { GamesInfo } from '../models/GamesInfo';
import { HTTPValidationError } from '../models/HTTPValidationError';
import { Markets } from '../models/Markets';
import { Participant } from '../models/Participant';
import { SportsBooks } from '../models/SportsBooks';
import { Usage } from '../models/Usage';

/**
 * no description
 */
export class DefaultApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Beta Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public async bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'gameId' is not null or undefined
        if (gameId === null || gameId === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet", "gameId");
        }


        // verify required parameter 'market' is not null or undefined
        if (market === null || market === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet", "market");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet", "apiKey");
        }




        // Path Params
        const localVarPath = '/beta/fantasy_lines/{game_id}/{market}'
            .replace('{' + 'game_id' + '}', encodeURIComponent(String(gameId)))
            .replace('{' + 'market' + '}', encodeURIComponent(String(market)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (activeOnly !== undefined) {
            requestContext.setQueryParam("active_only", ObjectSerializer.serialize(activeOnly, "boolean", ""));
        }

        // Query Params
        if (endDatetime !== undefined) {
            requestContext.setQueryParam("end_datetime", ObjectSerializer.serialize(endDatetime, "Date", "date-time"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Get Game
     * @param gameId 
     * @param apiKey 
     */
    public async bETAGetGameBetaGameGameIdGet(gameId: string, apiKey: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'gameId' is not null or undefined
        if (gameId === null || gameId === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetGameBetaGameGameIdGet", "gameId");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetGameBetaGameGameIdGet", "apiKey");
        }


        // Path Params
        const localVarPath = '/beta/game/{game_id}'
            .replace('{' + 'game_id' + '}', encodeURIComponent(String(gameId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Get Games
     * @param league 
     * @param apiKey 
     * @param date 
     * @param tz 
     */
    public async bETAGetGamesBetaGamesLeagueGet(league: string, apiKey: string, date: string, tz?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'league' is not null or undefined
        if (league === null || league === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetGamesBetaGamesLeagueGet", "league");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetGamesBetaGamesLeagueGet", "apiKey");
        }


        // verify required parameter 'date' is not null or undefined
        if (date === null || date === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetGamesBetaGamesLeagueGet", "date");
        }



        // Path Params
        const localVarPath = '/beta/games/{league}'
            .replace('{' + 'league' + '}', encodeURIComponent(String(league)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (date !== undefined) {
            requestContext.setQueryParam("date", ObjectSerializer.serialize(date, "string", "date"));
        }

        // Query Params
        if (tz !== undefined) {
            requestContext.setQueryParam("tz", ObjectSerializer.serialize(tz, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Get Markets
     * @param gameId 
     * @param apiKey 
     * @param fantasy 
     */
    public async bETAGetMarketsBetaMarketsGameIdGet(gameId: string, apiKey: string, fantasy?: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'gameId' is not null or undefined
        if (gameId === null || gameId === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetMarketsBetaMarketsGameIdGet", "gameId");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetMarketsBetaMarketsGameIdGet", "apiKey");
        }



        // Path Params
        const localVarPath = '/beta/markets/{game_id}'
            .replace('{' + 'game_id' + '}', encodeURIComponent(String(gameId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (fantasy !== undefined) {
            requestContext.setQueryParam("fantasy", ObjectSerializer.serialize(fantasy, "boolean", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public async bETAGetOddsBetaOddsGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'gameId' is not null or undefined
        if (gameId === null || gameId === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetOddsBetaOddsGameIdMarketGet", "gameId");
        }


        // verify required parameter 'market' is not null or undefined
        if (market === null || market === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetOddsBetaOddsGameIdMarketGet", "market");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetOddsBetaOddsGameIdMarketGet", "apiKey");
        }




        // Path Params
        const localVarPath = '/beta/odds/{game_id}/{market}'
            .replace('{' + 'game_id' + '}', encodeURIComponent(String(gameId)))
            .replace('{' + 'market' + '}', encodeURIComponent(String(market)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (activeOnly !== undefined) {
            requestContext.setQueryParam("active_only", ObjectSerializer.serialize(activeOnly, "boolean", ""));
        }

        // Query Params
        if (endDatetime !== undefined) {
            requestContext.setQueryParam("end_datetime", ObjectSerializer.serialize(endDatetime, "Date", "date-time"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Get Player
     * @param participantId 
     * @param apiKey 
     */
    public async bETAGetPlayerBetaParticipantParticipantIdGet(participantId: number, apiKey: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'participantId' is not null or undefined
        if (participantId === null || participantId === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetPlayerBetaParticipantParticipantIdGet", "participantId");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetPlayerBetaParticipantParticipantIdGet", "apiKey");
        }


        // Path Params
        const localVarPath = '/beta/participant/{participant_id}'
            .replace('{' + 'participant_id' + '}', encodeURIComponent(String(participantId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Get Usage
     * @param apiKey 
     */
    public async bETAGetUsageBetaUsageGet(apiKey: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETAGetUsageBetaUsageGet", "apiKey");
        }


        // Path Params
        const localVarPath = '/beta/usage';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Beta Lookup Player
     * @param name 
     * @param apiKey 
     */
    public async bETALookupPlayerBetaParticipantLookupGet(name: string, apiKey: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new RequiredError("DefaultApi", "bETALookupPlayerBetaParticipantLookupGet", "name");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "bETALookupPlayerBetaParticipantLookupGet", "apiKey");
        }


        // Path Params
        const localVarPath = '/beta/participant/lookup';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (name !== undefined) {
            requestContext.setQueryParam("name", ObjectSerializer.serialize(name, "string", ""));
        }

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * V1 Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public async v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'gameId' is not null or undefined
        if (gameId === null || gameId === undefined) {
            throw new RequiredError("DefaultApi", "v1GetFantasyLinesV1FantasyLinesGameIdMarketGet", "gameId");
        }


        // verify required parameter 'market' is not null or undefined
        if (market === null || market === undefined) {
            throw new RequiredError("DefaultApi", "v1GetFantasyLinesV1FantasyLinesGameIdMarketGet", "market");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "v1GetFantasyLinesV1FantasyLinesGameIdMarketGet", "apiKey");
        }




        // Path Params
        const localVarPath = '/v1/fantasy_lines/{game_id}/{market}'
            .replace('{' + 'game_id' + '}', encodeURIComponent(String(gameId)))
            .replace('{' + 'market' + '}', encodeURIComponent(String(market)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (activeOnly !== undefined) {
            requestContext.setQueryParam("active_only", ObjectSerializer.serialize(activeOnly, "boolean", ""));
        }

        // Query Params
        if (endDatetime !== undefined) {
            requestContext.setQueryParam("end_datetime", ObjectSerializer.serialize(endDatetime, "Date", "date-time"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param league 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     */
    public async v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league: string, market: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'league' is not null or undefined
        if (league === null || league === undefined) {
            throw new RequiredError("DefaultApi", "v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet", "league");
        }


        // verify required parameter 'market' is not null or undefined
        if (market === null || market === undefined) {
            throw new RequiredError("DefaultApi", "v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet", "market");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet", "apiKey");
        }



        // Path Params
        const localVarPath = '/v1/fantasy_snapshot/{league}/{market}'
            .replace('{' + 'league' + '}', encodeURIComponent(String(league)))
            .replace('{' + 'market' + '}', encodeURIComponent(String(market)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (activeOnly !== undefined) {
            requestContext.setQueryParam("active_only", ObjectSerializer.serialize(activeOnly, "boolean", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param league 
     * @param apiKey 
     * @param activeOnly 
     */
    public async v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'league' is not null or undefined
        if (league === null || league === undefined) {
            throw new RequiredError("DefaultApi", "v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet", "league");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet", "apiKey");
        }



        // Path Params
        const localVarPath = '/v1/fantasy_snapshot/{league}'
            .replace('{' + 'league' + '}', encodeURIComponent(String(league)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (activeOnly !== undefined) {
            requestContext.setQueryParam("active_only", ObjectSerializer.serialize(activeOnly, "boolean", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * V1 Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public async v1GetOddsV1OddsGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'gameId' is not null or undefined
        if (gameId === null || gameId === undefined) {
            throw new RequiredError("DefaultApi", "v1GetOddsV1OddsGameIdMarketGet", "gameId");
        }


        // verify required parameter 'market' is not null or undefined
        if (market === null || market === undefined) {
            throw new RequiredError("DefaultApi", "v1GetOddsV1OddsGameIdMarketGet", "market");
        }


        // verify required parameter 'apiKey' is not null or undefined
        if (apiKey === null || apiKey === undefined) {
            throw new RequiredError("DefaultApi", "v1GetOddsV1OddsGameIdMarketGet", "apiKey");
        }




        // Path Params
        const localVarPath = '/v1/odds/{game_id}/{market}'
            .replace('{' + 'game_id' + '}', encodeURIComponent(String(gameId)))
            .replace('{' + 'market' + '}', encodeURIComponent(String(market)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (apiKey !== undefined) {
            requestContext.setQueryParam("api_key", ObjectSerializer.serialize(apiKey, "string", ""));
        }

        // Query Params
        if (activeOnly !== undefined) {
            requestContext.setQueryParam("active_only", ObjectSerializer.serialize(activeOnly, "boolean", ""));
        }

        // Query Params
        if (endDatetime !== undefined) {
            requestContext.setQueryParam("end_datetime", ObjectSerializer.serialize(endDatetime, "Date", "date-time"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class DefaultApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FantasyBooks >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: FantasyBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasyBooks", ""
            ) as FantasyBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: FantasyBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasyBooks", ""
            ) as FantasyBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetGameBetaGameGameIdGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetGameBetaGameGameIdGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GameInfo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GameInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GameInfo", ""
            ) as GameInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: GameInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GameInfo", ""
            ) as GameInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetGamesBetaGamesLeagueGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetGamesBetaGamesLeagueGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GamesInfo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GamesInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GamesInfo", ""
            ) as GamesInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: GamesInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GamesInfo", ""
            ) as GamesInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetMarketsBetaMarketsGameIdGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Markets >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Markets = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Markets", ""
            ) as Markets;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Markets = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Markets", ""
            ) as Markets;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetOddsBetaOddsGameIdMarketGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SportsBooks >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: SportsBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SportsBooks", ""
            ) as SportsBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: SportsBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SportsBooks", ""
            ) as SportsBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetPlayerBetaParticipantParticipantIdGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Participant >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Participant = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Participant", ""
            ) as Participant;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Participant = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Participant", ""
            ) as Participant;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETAGetUsageBetaUsageGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETAGetUsageBetaUsageGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Usage >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Usage = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Usage", ""
            ) as Usage;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Usage = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Usage", ""
            ) as Usage;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bETALookupPlayerBetaParticipantLookupGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Participant >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Participant = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Participant", ""
            ) as Participant;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Participant = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Participant", ""
            ) as Participant;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1GetFantasyLinesV1FantasyLinesGameIdMarketGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FantasyBooks >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: FantasyBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasyBooks", ""
            ) as FantasyBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: FantasyBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasyBooks", ""
            ) as FantasyBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FantasySnapshot >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: FantasySnapshot = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasySnapshot", ""
            ) as FantasySnapshot;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: FantasySnapshot = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasySnapshot", ""
            ) as FantasySnapshot;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FantasyLeagueSnapshot >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: FantasyLeagueSnapshot = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasyLeagueSnapshot", ""
            ) as FantasyLeagueSnapshot;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: FantasyLeagueSnapshot = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FantasyLeagueSnapshot", ""
            ) as FantasyLeagueSnapshot;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1GetOddsV1OddsGameIdMarketGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SportsBooks >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: SportsBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SportsBooks", ""
            ) as SportsBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: HTTPValidationError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "HTTPValidationError", ""
            ) as HTTPValidationError;
            throw new ApiException<HTTPValidationError>(response.httpStatusCode, "Validation Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: SportsBooks = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SportsBooks", ""
            ) as SportsBooks;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
