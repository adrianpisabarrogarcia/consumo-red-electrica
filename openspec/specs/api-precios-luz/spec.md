# PVPC Hourly Prices API Integration Specification

## Purpose

This specification defines the behavior of the PVPC hourly prices API integration. The system connects to the Red Eléctrica de España (REE) public API to fetch daily electricity prices and caches them locally to optimize network usage.

## Requirements

| ID | Requirement | Strength | Description |
|---|---|---|---|
| REQ-API-FETCH | Fetch Hourly Prices | MUST | Retrieve hourly PVPC electricity prices from the REE API (`apidatos.ree.es`) for a given date. |
| REQ-API-CACHE | Local Storage Caching | MUST | Cache daily price data in the browser's `localStorage` to prevent duplicate network requests. |
| REQ-API-ERROR | Error Resilience | MUST | Handle network failures, API downtime, or invalid responses gracefully without crashing the UI. |

### Requirement: REQ-API-FETCH

The system MUST fetch daily PVPC hourly price data from `apidatos.ree.es` for a specified date.

#### Scenario: Successful price retrieval
- GIVEN the REE API is online and has data for the requested date
- WHEN the system requests the prices for that date
- THEN the system receives an array of exactly 24 hourly price records

### Requirement: REQ-API-CACHE

The system MUST cache the fetched daily price data in `localStorage` under a unique date-based key.

#### Scenario: Read from cache on subsequent request
- GIVEN daily prices for a date are already stored in `localStorage`
- WHEN the system requests prices for that date
- THEN it returns the cached data without triggering a network request

#### Scenario: Write to cache on fresh fetch
- GIVEN no cached data exists for the requested date and the API is online
- WHEN the system successfully fetches the prices from the API
- THEN it stores the 24 hourly price records in `localStorage` before returning them

### Requirement: REQ-API-ERROR

The system MUST handle network failures and API errors gracefully, returning a clear failure state.

#### Scenario: API is offline or returns error
- GIVEN the REE API is unreachable or returns a 500 status code
- WHEN the system requests prices for a date not present in the cache
- THEN it returns a clear connection error state and does not modify the cache
