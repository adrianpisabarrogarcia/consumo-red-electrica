# Tasks: Conectar API de Precios de Luz y Refactorización UI

## Phase 1: Infrastructure & Testing Setup
- [x] 1.1 Install `vitest` as a devDependency and configure the `test` execution script in `package.json`.
- [x] 1.2 Modify `vite.config.ts` to configure the Vitest environment.
- [x] 1.3 Action: Run `git commit -m "chore: setup vitest testing infrastructure" && git push` to verify and save the foundation.

## Phase 2: Price Calculations (TDD)
- [x] 2.1 [RED] Create `src/utils/priceCalculations.test.ts` with failing tests for daily average, cheapest hour, current price, and best 1-hour interval, covering all scenarios in `REQ-CALC-*`.
- [x] 2.2 [GREEN] Create `src/utils/priceCalculations.ts` implementing the mathematical logic to make all unit tests pass.
- [x] 2.3 [REFACTOR] Refactor code for optimization, ensuring 100% test coverage and clean code.
- [ ] 2.4 Action: Run `git commit -m "test: implement price calculations with 100% test coverage via TDD" && git push`.

## Phase 3: API Service & Caching
- [x] 3.1 Create `src/services/reeApi.ts` to fetch daily PVPC hourly price data from `apidatos.ree.es` following `REQ-API-FETCH`.
- [x] 3.2 Implement a robust client-side caching layer in `src/services/reeApi.ts` using `localStorage` to cache daily values under date-based keys (`pvpc-YYYY-MM-DD`).
- [x] 3.3 Add unit tests in `src/services/reeApi.test.ts` to mock the API response and verify correct cache write/read and fallback error handling.
- [ ] 3.4 Action: Run `git commit -m "feat: implement ree api service with localstorage caching and tests" && git push`.

## Phase 4: UI Infrastructure & Theme
- [x] 4.1 Import the `Outfit` typography from Google Fonts by adding the `<link>` tags in `index.html`.
- [x] 4.2 Configure the PrimeReact `lara-dark-blue` theme and override global styles in `src/App.css` using modern dark variables.
- [ ] 4.3 Action: Run `git commit -m "style: import outfit font and configure prime-react dark theme" && git push`.

## Phase 5: UI Refactoring & Component Integration
- [ ] 5.1 Refactor `src/components/PriceSummary.tsx` to a functional component using modern React 19 hooks and styling card grids with a minimalist dark theme.
- [ ] 5.2 Refactor `src/components/PriceTable.tsx` to a functional component, rendering a styled PrimeReact DataTable with custom dark borders and Outfit typography.
- [ ] 5.3 Refactor `src/App.tsx` to a functional component that orchestrates state (prices, loading, errors), fetches data on mount, and handles integration.
- [ ] 5.4 Action: Run `git commit -m "feat: refactor UI to functional components and integrate real-time API data" && git push`.
