import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     * Beta Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<HttpInfo<FantasyBooks>> {
        const requestContextPromise = this.requestFactory.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<FantasyBooks> {
        return this.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options).pipe(map((apiResponse: HttpInfo<FantasyBooks>) => apiResponse.data));
    }

    /**
     * Beta Get Game
     * @param gameId 
     * @param apiKey 
     */
    public bETAGetGameBetaGameGameIdGetWithHttpInfo(gameId: string, apiKey: string, _options?: Configuration): Observable<HttpInfo<GameInfo>> {
        const requestContextPromise = this.requestFactory.bETAGetGameBetaGameGameIdGet(gameId, apiKey, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetGameBetaGameGameIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Game
     * @param gameId 
     * @param apiKey 
     */
    public bETAGetGameBetaGameGameIdGet(gameId: string, apiKey: string, _options?: Configuration): Observable<GameInfo> {
        return this.bETAGetGameBetaGameGameIdGetWithHttpInfo(gameId, apiKey, _options).pipe(map((apiResponse: HttpInfo<GameInfo>) => apiResponse.data));
    }

    /**
     * Beta Get Games
     * @param league 
     * @param apiKey 
     * @param date 
     * @param tz 
     */
    public bETAGetGamesBetaGamesLeagueGetWithHttpInfo(league: string, apiKey: string, date: string, tz?: string, _options?: Configuration): Observable<HttpInfo<GamesInfo>> {
        const requestContextPromise = this.requestFactory.bETAGetGamesBetaGamesLeagueGet(league, apiKey, date, tz, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetGamesBetaGamesLeagueGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Games
     * @param league 
     * @param apiKey 
     * @param date 
     * @param tz 
     */
    public bETAGetGamesBetaGamesLeagueGet(league: string, apiKey: string, date: string, tz?: string, _options?: Configuration): Observable<GamesInfo> {
        return this.bETAGetGamesBetaGamesLeagueGetWithHttpInfo(league, apiKey, date, tz, _options).pipe(map((apiResponse: HttpInfo<GamesInfo>) => apiResponse.data));
    }

    /**
     * Beta Get Markets
     * @param gameId 
     * @param apiKey 
     * @param fantasy 
     */
    public bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(gameId: string, apiKey: string, fantasy?: boolean, _options?: Configuration): Observable<HttpInfo<Markets>> {
        const requestContextPromise = this.requestFactory.bETAGetMarketsBetaMarketsGameIdGet(gameId, apiKey, fantasy, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Markets
     * @param gameId 
     * @param apiKey 
     * @param fantasy 
     */
    public bETAGetMarketsBetaMarketsGameIdGet(gameId: string, apiKey: string, fantasy?: boolean, _options?: Configuration): Observable<Markets> {
        return this.bETAGetMarketsBetaMarketsGameIdGetWithHttpInfo(gameId, apiKey, fantasy, _options).pipe(map((apiResponse: HttpInfo<Markets>) => apiResponse.data));
    }

    /**
     * Beta Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<HttpInfo<SportsBooks>> {
        const requestContextPromise = this.requestFactory.bETAGetOddsBetaOddsGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public bETAGetOddsBetaOddsGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<SportsBooks> {
        return this.bETAGetOddsBetaOddsGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options).pipe(map((apiResponse: HttpInfo<SportsBooks>) => apiResponse.data));
    }

    /**
     * Beta Get Player
     * @param participantId 
     * @param apiKey 
     */
    public bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(participantId: number, apiKey: string, _options?: Configuration): Observable<HttpInfo<Participant>> {
        const requestContextPromise = this.requestFactory.bETAGetPlayerBetaParticipantParticipantIdGet(participantId, apiKey, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Player
     * @param participantId 
     * @param apiKey 
     */
    public bETAGetPlayerBetaParticipantParticipantIdGet(participantId: number, apiKey: string, _options?: Configuration): Observable<Participant> {
        return this.bETAGetPlayerBetaParticipantParticipantIdGetWithHttpInfo(participantId, apiKey, _options).pipe(map((apiResponse: HttpInfo<Participant>) => apiResponse.data));
    }

    /**
     * Beta Get Usage
     * @param apiKey 
     */
    public bETAGetUsageBetaUsageGetWithHttpInfo(apiKey: string, _options?: Configuration): Observable<HttpInfo<Usage>> {
        const requestContextPromise = this.requestFactory.bETAGetUsageBetaUsageGet(apiKey, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETAGetUsageBetaUsageGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Get Usage
     * @param apiKey 
     */
    public bETAGetUsageBetaUsageGet(apiKey: string, _options?: Configuration): Observable<Usage> {
        return this.bETAGetUsageBetaUsageGetWithHttpInfo(apiKey, _options).pipe(map((apiResponse: HttpInfo<Usage>) => apiResponse.data));
    }

    /**
     * Beta Lookup Player
     * @param name 
     * @param apiKey 
     */
    public bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(name: string, apiKey: string, _options?: Configuration): Observable<HttpInfo<Participant>> {
        const requestContextPromise = this.requestFactory.bETALookupPlayerBetaParticipantLookupGet(name, apiKey, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Beta Lookup Player
     * @param name 
     * @param apiKey 
     */
    public bETALookupPlayerBetaParticipantLookupGet(name: string, apiKey: string, _options?: Configuration): Observable<Participant> {
        return this.bETALookupPlayerBetaParticipantLookupGetWithHttpInfo(name, apiKey, _options).pipe(map((apiResponse: HttpInfo<Participant>) => apiResponse.data));
    }

    /**
     * V1 Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<HttpInfo<FantasyBooks>> {
        const requestContextPromise = this.requestFactory.v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * V1 Get Fantasy Lines
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<FantasyBooks> {
        return this.v1GetFantasyLinesV1FantasyLinesGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options).pipe(map((apiResponse: HttpInfo<FantasyBooks>) => apiResponse.data));
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param league 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(league: string, market: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Observable<HttpInfo<FantasySnapshot>> {
        const requestContextPromise = this.requestFactory.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league, market, apiKey, activeOnly, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get all active fantasy lines for the given league and market.
     * V1 Get Fantasy Snapshot
     * @param league 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league: string, market: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Observable<FantasySnapshot> {
        return this.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetWithHttpInfo(league, market, apiKey, activeOnly, _options).pipe(map((apiResponse: HttpInfo<FantasySnapshot>) => apiResponse.data));
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param league 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(league: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Observable<HttpInfo<FantasyLeagueSnapshot>> {
        const requestContextPromise = this.requestFactory.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league, apiKey, activeOnly, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get all active fantasy lines for the given league.
     * V1 Get League Fantasy Snapshot
     * @param league 
     * @param apiKey 
     * @param activeOnly 
     */
    public v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league: string, apiKey: string, activeOnly?: boolean, _options?: Configuration): Observable<FantasyLeagueSnapshot> {
        return this.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetWithHttpInfo(league, apiKey, activeOnly, _options).pipe(map((apiResponse: HttpInfo<FantasyLeagueSnapshot>) => apiResponse.data));
    }

    /**
     * V1 Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<HttpInfo<SportsBooks>> {
        const requestContextPromise = this.requestFactory.v1GetOddsV1OddsGameIdMarketGet(gameId, market, apiKey, activeOnly, endDatetime, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * V1 Get Odds
     * @param gameId 
     * @param market 
     * @param apiKey 
     * @param activeOnly 
     * @param endDatetime 
     */
    public v1GetOddsV1OddsGameIdMarketGet(gameId: string, market: string, apiKey: string, activeOnly?: boolean, endDatetime?: Date, _options?: Configuration): Observable<SportsBooks> {
        return this.v1GetOddsV1OddsGameIdMarketGetWithHttpInfo(gameId, market, apiKey, activeOnly, endDatetime, _options).pipe(map((apiResponse: HttpInfo<SportsBooks>) => apiResponse.data));
    }

}
