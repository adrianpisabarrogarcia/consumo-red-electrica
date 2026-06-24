# Price Statistics Calculations Specification

## Purpose

This specification defines the pure mathematical calculations performed on the daily PVPC hourly price data. These calculations produce statistics such as average price, cheapest hour, current price, and the best 1-hour interval.

## Requirements

| ID | Requirement | Strength | Description |
|---|---|---|---|
| REQ-CALC-AVG | Daily Average Price | MUST | Calculate the arithmetic mean of all 24 hourly prices of the day. |
| REQ-CALC-CHEAPEST | Cheapest Hour | MUST | Identify the hour (0-23) with the lowest price of the day. |
| REQ-CALC-CURRENT | Current Price | MUST | Determine the price corresponding to a specific hour (usually the current hour). |
| REQ-CALC-BEST-INTERVAL | Best 1-Hour Interval | MUST | Find the 1-hour interval with the lowest average price. |
| REQ-CALC-EDGE | Invalid Data Handling | MUST | Handle empty, incomplete, or invalid price arrays safely without throwing unhandled exceptions. |

### Requirement: REQ-CALC-AVG

The system MUST calculate the average price of the day from the 24 hourly price records.

#### Scenario: Successful daily average calculation
- GIVEN a valid array of 24 hourly price records
- WHEN the system calculates the daily average
- THEN it returns the correct arithmetic mean of the 24 price values

### Requirement: REQ-CALC-CHEAPEST

The system MUST identify the cheapest hour of the day.

#### Scenario: Successful cheapest hour identification
- GIVEN a valid array of 24 hourly price records
- WHEN the system searches for the cheapest hour
- THEN it returns the hour index (0-23) and the price of the lowest record

### Requirement: REQ-CALC-CURRENT

The system MUST identify the price corresponding to a specific hour.

#### Scenario: Successful current price retrieval
- GIVEN a valid array of 24 hourly price records and the target hour is 14:00
- WHEN the system retrieves the current price
- THEN it returns the price record corresponding to the 14:00-15:00 interval

### Requirement: REQ-CALC-BEST-INTERVAL

The system MUST compute the best 1-hour interval (lowest average).

#### Scenario: Successful best 1-hour interval calculation
- GIVEN a valid array of 24 hourly price records
- WHEN the system calculates the best 1-hour interval
- THEN it returns the start hour of the 1-hour interval with the lowest average price

### Requirement: REQ-CALC-EDGE

The system MUST handle empty or invalid price arrays safely.

#### Scenario: Handle empty or null price data
- GIVEN an empty or null array of hourly price records
- WHEN any calculation function is called
- THEN the system returns a safe default value (e.g., 0 or null)
