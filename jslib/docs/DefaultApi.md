# PropOddsApi.DefaultApi

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



## bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet

> FantasyBooks bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId, market, apiKey, opts)

Beta Get Fantasy Lines

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let gameId = "gameId_example"; // String | 
let market = "market_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'activeOnly': false, // Boolean | 
  'endDatetime': new Date("2013-10-20T19:20:30+01:00") // Date | 
};
apiInstance.bETAGetFantasyLinesBetaFantasyLinesGameIdMarketGet(gameId, market, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | **String**|  | 
 **market** | **String**|  | 
 **apiKey** | **String**|  | 
 **activeOnly** | **Boolean**|  | [optional] [default to false]
 **endDatetime** | **Date**|  | [optional] 

### Return type

[**FantasyBooks**](FantasyBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETAGetGameBetaGameGameIdGet

> GameInfo bETAGetGameBetaGameGameIdGet(gameId, apiKey)

Beta Get Game

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let gameId = "gameId_example"; // String | 
let apiKey = "apiKey_example"; // String | 
apiInstance.bETAGetGameBetaGameGameIdGet(gameId, apiKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | **String**|  | 
 **apiKey** | **String**|  | 

### Return type

[**GameInfo**](GameInfo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETAGetGamesBetaGamesLeagueGet

> GamesInfo bETAGetGamesBetaGamesLeagueGet(league, apiKey, date, opts)

Beta Get Games

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let league = "league_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let date = new Date("2013-10-20"); // Date | 
let opts = {
  'tz': "tz_example" // String | 
};
apiInstance.bETAGetGamesBetaGamesLeagueGet(league, apiKey, date, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **league** | **String**|  | 
 **apiKey** | **String**|  | 
 **date** | **Date**|  | 
 **tz** | **String**|  | [optional] 

### Return type

[**GamesInfo**](GamesInfo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETAGetMarketsBetaMarketsGameIdGet

> Markets bETAGetMarketsBetaMarketsGameIdGet(gameId, apiKey, opts)

Beta Get Markets

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let gameId = "gameId_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'fantasy': false // Boolean | 
};
apiInstance.bETAGetMarketsBetaMarketsGameIdGet(gameId, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | **String**|  | 
 **apiKey** | **String**|  | 
 **fantasy** | **Boolean**|  | [optional] [default to false]

### Return type

[**Markets**](Markets.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETAGetOddsBetaOddsGameIdMarketGet

> SportsBooks bETAGetOddsBetaOddsGameIdMarketGet(gameId, market, apiKey, opts)

Beta Get Odds

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let gameId = "gameId_example"; // String | 
let market = "market_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'activeOnly': false, // Boolean | 
  'endDatetime': new Date("2013-10-20T19:20:30+01:00") // Date | 
};
apiInstance.bETAGetOddsBetaOddsGameIdMarketGet(gameId, market, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | **String**|  | 
 **market** | **String**|  | 
 **apiKey** | **String**|  | 
 **activeOnly** | **Boolean**|  | [optional] [default to false]
 **endDatetime** | **Date**|  | [optional] 

### Return type

[**SportsBooks**](SportsBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETAGetPlayerBetaParticipantParticipantIdGet

> Participant bETAGetPlayerBetaParticipantParticipantIdGet(participantId, apiKey)

Beta Get Player

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let participantId = 56; // Number | 
let apiKey = "apiKey_example"; // String | 
apiInstance.bETAGetPlayerBetaParticipantParticipantIdGet(participantId, apiKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **participantId** | **Number**|  | 
 **apiKey** | **String**|  | 

### Return type

[**Participant**](Participant.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETAGetUsageBetaUsageGet

> Usage bETAGetUsageBetaUsageGet(apiKey)

Beta Get Usage

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let apiKey = "apiKey_example"; // String | 
apiInstance.bETAGetUsageBetaUsageGet(apiKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiKey** | **String**|  | 

### Return type

[**Usage**](Usage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## bETALookupPlayerBetaParticipantLookupGet

> Participant bETALookupPlayerBetaParticipantLookupGet(name, apiKey)

Beta Lookup Player

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let name = "name_example"; // String | 
let apiKey = "apiKey_example"; // String | 
apiInstance.bETALookupPlayerBetaParticipantLookupGet(name, apiKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **String**|  | 
 **apiKey** | **String**|  | 

### Return type

[**Participant**](Participant.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## v1GetFantasyLinesV1FantasyLinesGameIdMarketGet

> FantasyBooks v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId, market, apiKey, opts)

V1 Get Fantasy Lines

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let gameId = "gameId_example"; // String | 
let market = "market_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'activeOnly': true, // Boolean | 
  'endDatetime': new Date("2013-10-20T19:20:30+01:00") // Date | 
};
apiInstance.v1GetFantasyLinesV1FantasyLinesGameIdMarketGet(gameId, market, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | **String**|  | 
 **market** | **String**|  | 
 **apiKey** | **String**|  | 
 **activeOnly** | **Boolean**|  | [optional] [default to true]
 **endDatetime** | **Date**|  | [optional] 

### Return type

[**FantasyBooks**](FantasyBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet

> FantasySnapshot v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league, market, apiKey, opts)

V1 Get Fantasy Snapshot

Get all active fantasy lines for the given league and market.

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let league = "league_example"; // String | 
let market = "market_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'activeOnly': true // Boolean | 
};
apiInstance.v1GetFantasySnapshotV1FantasySnapshotLeagueMarketGet(league, market, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **league** | **String**|  | 
 **market** | **String**|  | 
 **apiKey** | **String**|  | 
 **activeOnly** | **Boolean**|  | [optional] [default to true]

### Return type

[**FantasySnapshot**](FantasySnapshot.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet

> FantasyLeagueSnapshot v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league, apiKey, opts)

V1 Get League Fantasy Snapshot

Get all active fantasy lines for the given league.

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let league = "league_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'activeOnly': true // Boolean | 
};
apiInstance.v1GetLeagueFantasySnapshotV1FantasySnapshotLeagueGet(league, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **league** | **String**|  | 
 **apiKey** | **String**|  | 
 **activeOnly** | **Boolean**|  | [optional] [default to true]

### Return type

[**FantasyLeagueSnapshot**](FantasyLeagueSnapshot.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## v1GetOddsV1OddsGameIdMarketGet

> SportsBooks v1GetOddsV1OddsGameIdMarketGet(gameId, market, apiKey, opts)

V1 Get Odds

### Example

```javascript
import PropOddsApi from 'prop_odds_api';

let apiInstance = new PropOddsApi.DefaultApi();
let gameId = "gameId_example"; // String | 
let market = "market_example"; // String | 
let apiKey = "apiKey_example"; // String | 
let opts = {
  'activeOnly': true, // Boolean | 
  'endDatetime': new Date("2013-10-20T19:20:30+01:00") // Date | 
};
apiInstance.v1GetOddsV1OddsGameIdMarketGet(gameId, market, apiKey, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gameId** | **String**|  | 
 **market** | **String**|  | 
 **apiKey** | **String**|  | 
 **activeOnly** | **Boolean**|  | [optional] [default to true]
 **endDatetime** | **Date**|  | [optional] 

### Return type

[**SportsBooks**](SportsBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

