# Price Table Filtering Specification

## Purpose

This specification defines the behavior of the column-level filtering capabilities in the PVPC electricity price table. Users MUST be able to easily search and filter hourly prices by hour, price value, and tariff status ("Barata", "Normal", "Cara") directly within the tabular view to make informed consumption decisions.

## Requirements

| ID | Requirement | Strength | Description |
|---|---|---|---|
| REQ-FILT-HOUR | Filter by Hour | MUST | Provide a dropdown selector in the hour column filter allowing users to select and filter by specific hourly ranges (e.g., "12:00 - 13:00"). |
| REQ-SORT-PRICE | Sort by Price | MUST | Support ascending and descending sorting on the price column, and MUST NOT display any text or numeric input filter. |
| REQ-FILT-STATUS | Filter by Tariff Status | MUST | Provide a dropdown or selector in the status column filter allowing users to filter hours by their classification: "Barata", "Normal", or "Cara". |

### Requirement: REQ-FILT-HOUR

The price table filtering system MUST allow users to filter rows by hour using a dropdown selector containing the 24 hourly ranges.

#### Scenario: User selects a specific hour range
- GIVEN the price table is loaded with 24 hourly price records
- WHEN the user selects the "12:00 - 13:00" option in the hour dropdown filter
- THEN the table displays only the row representing the "12:00 - 13:00" interval

#### Scenario: User clears the hour filter
- GIVEN the table is currently filtered to show only "12:00 - 13:00"
- WHEN the user clears the selected option or selects the clear action in the hour dropdown filter
- THEN the table displays all 24 hourly price records again

---

### Requirement: REQ-SORT-PRICE

The price table system MUST support sorting the price values in ascending and descending order. The price column MUST NOT have a text input filter.

#### Scenario: User sorts by price in ascending order
- GIVEN the price table is loaded with 24 hourly price records
- WHEN the user clicks the header of the Price column to sort in ascending order
- THEN the table displays the hourly records ordered from the lowest price to the highest price

#### Scenario: User sorts by price in descending order
- GIVEN the price table is sorted in ascending order
- WHEN the user clicks the header of the Price column again to sort in descending order
- THEN the table displays the hourly records ordered from the highest price to the lowest price

---

### Requirement: REQ-FILT-STATUS

The price table filtering system MUST provide a dropdown selector to filter hourly records by their tariff status classification. The available options MUST be "Barata", "Normal", and "Cara".

#### Scenario: User filters by "Barata" status
- GIVEN the price table is loaded with hourly records classified as "Barata", "Normal", and "Cara"
- WHEN the user selects "Barata" from the tariff status dropdown filter
- THEN the table displays only the rows classified as "Barata" (cheap tariff hours)

#### Scenario: User resets the status filter
- GIVEN the table is currently filtered by the "Barata" tariff status
- WHEN the user selects the clear/empty option in the dropdown filter
- THEN the table displays all hourly records regardless of their tariff status
