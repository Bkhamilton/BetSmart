# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet**](DefaultApi.md#bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet) | **GET** /beta/fantasy_lines/{game_id}/{market} | Beta Get Fantasy Lines
[**bETAGetGameBetaGameGameIdGet**](DefaultApi.md#bETAGetGameBetaGameGameIdGet) | **GET** /beta/game/{game_id} | Beta Get Game
[**bETAGetGamesBetaGamesLeagueGet**](DefaultApi.md#bETAGetGamesBetaGamesLeagueGet) | **GET** /beta/games/{league} | Beta Get Games
[**bETAGetMarketsBetaMarketsGameIdGet**](DefaultApi.md#bETAGetMarketsBetaMarketsGameIdGet) | **GET** /beta/markets/{game_id} | Beta Get Markets
[**bETAGetOddsBetaOddsGameIdMarketGet**](DefaultApi.md#bETAGetOddsBetaOddsGameIdMarketGet) | **GET** /beta/odds/{game_id}/{market} | Beta Get Odds
[**bETAGetPlayerBetaParticipantParticipantIdGet**](DefaultApi.md#bETAGetPlayerBetaParticipantParticipantIdGet) | **GET** /beta/participant/{participant_id} | Beta Get Player
[**bETAGetUsageBetaUsageGet**](DefaultApi.md#bETAGetUsageBetaUsageGet) | **GET** /beta/usage | Beta Get Usage
[**bETALookupPlayerBetaParticipantLookupGet**](DefaultApi.md#bETALookupPlayerBetaParticipantLookupGet) | **GET** /beta/participant/lookup | Beta Lookup Player
[**v1GetFantasyLinesV1FantasyLinesGameIdMarketGet**](DefaultApi.md#v1GetFantasyLinesV1FantasyLinesGameIdMarketGet) | **GET** /v1/fantasy_lines/{game_id}/{market} | V1 Get Fantasy Lines
[**v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet**](DefaultApi.md#v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet) | **GET** /v1/fantasy_snapshot/{league}/{market} | V1 Get Fantasy Snapshot
[**v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet**](DefaultApi.md#v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet) | **GET** /v1/fantasy_snapshot/{league} | V1 Get League Fantasy Snapshot
[**v1GetOddsV1OddsGameIdMarketGet**](DefaultApi.md#v1GetOddsV1OddsGameIdMarketGet) | **GET** /v1/odds/{game_id}/{market} | V1 Get Odds


# **bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet**
> FantasyBooks bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetFantasyLinesBetaFantasyLinesGameIdMarketGetRequest = {
  // string
  gameId: "game_id_example",
  // string
  market: "market_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  activeOnly: false,
  // Date (optional)
  endDatetime: new Date('1970-01-01T00:00:00.00Z'),
};

apiInstance.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | [**string**] |  | defaults to undefined
 **market** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **activeOnly** | [**boolean**] |  | (optional) defaults to false
 **endDatetime** | [**Date**] |  | (optional) defaults to undefined


### Return type

**FantasyBooks**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETAGetGameBetaGameGameIdGet**
> GameInfo bETAGetGameBetaGameGameIdGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetGameBetaGameGameIdGetRequest = {
  // string
  gameId: "game_id_example",
  // string
  apiKey: "api_key_example",
};

apiInstance.bETAGetGameBetaGameGameIdGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined


### Return type

**GameInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETAGetGamesBetaGamesLeagueGet**
> GamesInfo bETAGetGamesBetaGamesLeagueGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetGamesBetaGamesLeagueGetRequest = {
  // string
  league: "league_example",
  // string
  apiKey: "api_key_example",
  // string
  date: new Date('1970-01-01').toISOString().split('T')[0];,
  // string (optional)
  tz: "tz_example",
};

apiInstance.bETAGetGamesBetaGamesLeagueGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **league** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **date** | [**string**] |  | defaults to undefined
 **tz** | [**string**] |  | (optional) defaults to undefined


### Return type

**GamesInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETAGetMarketsBetaMarketsGameIdGet**
> Markets bETAGetMarketsBetaMarketsGameIdGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetMarketsBetaMarketsGameIdGetRequest = {
  // string
  gameId: "game_id_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  fantasy: false,
};

apiInstance.bETAGetMarketsBetaMarketsGameIdGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **fantasy** | [**boolean**] |  | (optional) defaults to false


### Return type

**Markets**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETAGetOddsBetaOddsGameIdMarketGet**
> SportsBooks bETAGetOddsBetaOddsGameIdMarketGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetOddsBetaOddsGameIdMarketGetRequest = {
  // string
  gameId: "game_id_example",
  // string
  market: "market_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  activeOnly: false,
  // Date (optional)
  endDatetime: new Date('1970-01-01T00:00:00.00Z'),
};

apiInstance.bETAGetOddsBetaOddsGameIdMarketGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | [**string**] |  | defaults to undefined
 **market** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **activeOnly** | [**boolean**] |  | (optional) defaults to false
 **endDatetime** | [**Date**] |  | (optional) defaults to undefined


### Return type

**SportsBooks**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETAGetPlayerBetaParticipantParticipantIdGet**
> Participant bETAGetPlayerBetaParticipantParticipantIdGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetPlayerBetaParticipantParticipantIdGetRequest = {
  // number
  participantId: 1,
  // string
  apiKey: "api_key_example",
};

apiInstance.bETAGetPlayerBetaParticipantParticipantIdGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **participantId** | [**number**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined


### Return type

**Participant**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETAGetUsageBetaUsageGet**
> Usage bETAGetUsageBetaUsageGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETAGetUsageBetaUsageGetRequest = {
  // string
  apiKey: "api_key_example",
};

apiInstance.bETAGetUsageBetaUsageGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiKey** | [**string**] |  | defaults to undefined


### Return type

**Usage**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bETALookupPlayerBetaParticipantLookupGet**
> Participant bETALookupPlayerBetaParticipantLookupGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiBETALookupPlayerBetaParticipantLookupGetRequest = {
  // string
  name: "name_example",
  // string
  apiKey: "api_key_example",
};

apiInstance.bETALookupPlayerBetaParticipantLookupGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined


### Return type

**Participant**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1GetFantasyLinesV1FantasyLinesGameIdMarketGet**
> FantasyBooks v1GetFantasyLinesV1FantasyLinesGameIdMarketGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiV1GetFantasyLinesV1FantasyLinesGameIdMarketGetRequest = {
  // string
  gameId: "game_id_example",
  // string
  market: "market_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  activeOnly: true,
  // Date (optional)
  endDatetime: new Date('1970-01-01T00:00:00.00Z'),
};

apiInstance.v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | [**string**] |  | defaults to undefined
 **market** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **activeOnly** | [**boolean**] |  | (optional) defaults to true
 **endDatetime** | [**Date**] |  | (optional) defaults to undefined


### Return type

**FantasyBooks**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet**
> FantasySnapshot v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet()

Get all active fantasy lines for the given league and market.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiV1GetFantasySnapshotV1FantasySnapshotLeagueMarketGetRequest = {
  // string
  league: "league_example",
  // string
  market: "market_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  activeOnly: true,
};

apiInstance.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **league** | [**string**] |  | defaults to undefined
 **market** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **activeOnly** | [**boolean**] |  | (optional) defaults to true


### Return type

**FantasySnapshot**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet**
> FantasyLeagueSnapshot v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet()

Get all active fantasy lines for the given league.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiV1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGetRequest = {
  // string
  league: "league_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  activeOnly: true,
};

apiInstance.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **league** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **activeOnly** | [**boolean**] |  | (optional) defaults to true


### Return type

**FantasyLeagueSnapshot**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1GetOddsV1OddsGameIdMarketGet**
> SportsBooks v1GetOddsV1OddsGameIdMarketGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiV1GetOddsV1OddsGameIdMarketGetRequest = {
  // string
  gameId: "game_id_example",
  // string
  market: "market_example",
  // string
  apiKey: "api_key_example",
  // boolean (optional)
  activeOnly: true,
  // Date (optional)
  endDatetime: new Date('1970-01-01T00:00:00.00Z'),
};

apiInstance.v1GetOddsV1OddsGameIdMarketGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | [**string**] |  | defaults to undefined
 **market** | [**string**] |  | defaults to undefined
 **apiKey** | [**string**] |  | defaults to undefined
 **activeOnly** | [**boolean**] |  | (optional) defaults to true
 **endDatetime** | [**Date**] |  | (optional) defaults to undefined


### Return type

**SportsBooks**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


