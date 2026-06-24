# Appliance Consumption Recommendation Specification

## Purpose
This specification defines the functional requirements and behavior of the mathematical calculations and the UI component for the Appliance Consumption Recommendation Module.

## Requirements

| ID | Requirement | Strength | Description |
|---|---|---|---|
| REQ-REC-BEST-WINDOW | Find Best Window | MUST | Find the consecutive window of `durationHours` that has the lowest average price. |
| REQ-REC-CATEGORIZE | Categorize Hours | MUST | Categorize each hour as 'cheap' (< 90% of avg), 'expensive' (> 110% of avg), or 'normal'. |
| REQ-REC-UI-CARDS | Appliance Cards | MUST | Render cards for Lavadora (2h), Lavavajillas (2h), Horno (1h), and Termo Eléctrico (3h) showing recommended slot, average price, and savings badge. |
| REQ-REC-UI-TRAFFIC-LIGHT | Semáforo Energético | MUST | Render lists of cheap hours (emerald green) and expensive hours (rose red) to avoid. |
| REQ-REC-UI-BANNER | Practical Tip Banner | MUST | Render a banner with practical energy-saving advice. |
| REQ-REC-INTEGRATION | Dashboard Integration | MUST | Integrate the module inside `src/App.tsx` between the Price Summary and Price Table. |
| REQ-REC-EDGE | Edge Case Safety | MUST | Handle invalid, empty, or boundary price data safely without crashing. |

---

### Requirement: REQ-REC-BEST-WINDOW (Find Best Window)
The algorithm must calculate the moving average of consecutive price records of length `durationHours` and return the window starting hour, ending hour, and average price of the cheapest window.

#### Scenario: Valid 24-hour array and 2-hour duration
- GIVEN a valid array of 24 hourly price records
- WHEN `findBestWindowForAppliance(prices, 2)` is called
- THEN it returns the start hour, end hour, and average price of the 2-hour consecutive window with the lowest average price.

#### Scenario: Multiple windows with same minimum average
- GIVEN a price array where two different 2-hour windows have the same lowest average price
- WHEN `findBestWindowForAppliance(prices, 2)` is called
- THEN it returns the first window found.

#### Scenario: Duration equals array length
- GIVEN a valid array of 24 hourly price records
- WHEN `findBestWindowForAppliance(prices, 24)` is called
- THEN it returns start hour 0, end hour 24, and the daily average price.

#### Scenario: Duration greater than array length
- GIVEN a valid array of 24 hourly price records
- WHEN `findBestWindowForAppliance(prices, 25)` is called
- THEN it returns `null`.

#### Scenario: Invalid or empty inputs
- GIVEN an empty array, a duration <= 0, or non-integer duration
- WHEN `findBestWindowForAppliance` is called
- THEN it returns `null`.

---

### Requirement: REQ-REC-CATEGORIZE (Categorize Hours)
The algorithm must calculate the daily average price and categorize each hour based on its ratio to that average.

#### Scenario: Normal price distribution
- GIVEN a price array with average price 0.15 €/kWh
- WHEN `categorizeHours(prices, 0.15)` is called
- THEN:
  - Hours with price < 0.135 €/kWh (90%) are categorized as `'cheap'`.
  - Hours with price > 0.165 €/kWh (110%) are categorized as `'expensive'`.
  - Other hours are categorized as `'normal'`.

#### Scenario: Invalid or empty inputs
- GIVEN an empty price array or a daily average <= 0
- WHEN `categorizeHours` is called
- THEN it returns an empty array.

---

### Requirement: REQ-REC-UI-CARDS (Appliance Cards)
The UI component must render a responsive grid containing four specific appliance cards.

#### Scenario: Rendering Appliance Cards
- GIVEN the component is rendered with valid prices and averagePrice
- THEN it displays four cards:
  - **Lavadora**: 2h duration, icon `pi pi-cog` (or custom), recommended slot, average price, and savings badge.
  - **Lavavajillas**: 2h duration, icon `pi pi-sync` (or custom), recommended slot, average price, and savings badge.
  - **Horno**: 1h duration, icon `pi pi-database` (or custom), recommended slot, average price, and savings badge.
  - **Termo Eléctrico**: 3h duration, icon `pi pi-sliders-h` (or custom), recommended slot, average price, and savings badge.
- AND the savings badge displays the percentage of savings of the recommended slot's average price compared to the maximum (peak) hour price of the day: `Savings = Math.round((1 - windowAverage / peakPrice) * 100)`.

---

### Requirement: REQ-REC-UI-TRAFFIC-LIGHT (Semáforo Energético)
The UI component must show categorized hours to guide the user.

#### Scenario: Rendering Semáforo Energético
- GIVEN the component is rendered with cheap and expensive hours
- THEN it displays two distinct lists:
  - **Horas más recomendadas (Baratas)**: A list of hour ranges (e.g. `14:00 - 18:00` or individual hours) categorized as `'cheap'` formatted in emerald green.
  - **Horas a evitar (Caras)**: A list of hour ranges (e.g. `19:00 - 22:00` or individual hours) categorized as `'expensive'` formatted in rose red.

---

### Requirement: REQ-REC-UI-BANNER (Practical Tip Banner)
The UI component must display a text banner with actionable tips.

#### Scenario: Rendering Practical Tip Banner
- GIVEN the component is rendered
- THEN it displays: `"Consejo: Programá tus electrodomésticos de alto consumo en las horas baratas. Si usás la lavadora a las 15:00 en lugar de las 21:00, podés ahorrar un gran porcentaje en tu factura."`

---

### Requirement: REQ-REC-INTEGRATION (Dashboard Integration)
The component must integrate cleanly in the main application flow.

#### Scenario: App.tsx rendering
- GIVEN the dashboard loads successfully with price data
- WHEN the main content is rendered
- THEN `<ApplianceRecommendations prices={prices} averagePrice={stats.averagePrice} />` is rendered between `<PriceSummary>` and `<PriceTable>`.
