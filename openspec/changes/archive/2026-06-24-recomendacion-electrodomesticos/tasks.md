# Tasks: Appliance Consumption Recommendation Module

This document tracks the execution steps for implementing the Appliance Consumption Recommendation Module.

## Phase 1: Core Mathematical Utilities (TDD First!)
- [ ] **Task 1.1**: Create `src/utils/applianceRecommendations.test.ts` with comprehensive unit tests.
  - Coverage must include: happy paths, empty arrays, edge cases, negative/zero durations, window boundary limits, and identical average ties.
- [ ] **Task 1.2**: Create `src/utils/applianceRecommendations.ts` with the mathematical implementations.
  - Implement `findBestWindowForAppliance`.
  - Implement `categorizeHours`.
- [ ] **Task 1.3**: Run unit tests using `npx vitest run` and verify they pass.

## Phase 2: UI Component Development
- [ ] **Task 2.1**: Create `src/components/ApplianceRecommendations.tsx`.
  - Implement props: `prices: HourlyPrice[]` and `averagePrice: number`.
  - Design the main translucent dark container card.
- [ ] **Task 2.2**: Implement Section 1 (Optimización por Electrodomésticos).
  - Cards for Lavadora (2h), Lavavajillas (2h), Horno (1h), Termo Eléctrico (3h).
  - Calculate peak price of the day to compute precise savings percentages.
  - Format prices to 4 decimal places with standard unit suffix (€/kWh).
- [ ] **Task 2.3**: Implement Section 2 (Semáforo Energético de Hoy).
  - Implement consecutive hour grouping helper to format clean ranges (e.g., `14:00 - 18:00`).
  - Render separate lists for cheap hours (emerald green) and expensive hours (rose red).
- [ ] **Task 2.4**: Implement Section 3 (Practical Tip Banner).
  - Render the banner with the exact specified text advice.

## Phase 3: Dashboard Integration
- [ ] **Task 3.1**: Modify `src/App.tsx`.
  - Import `ApplianceRecommendations` component.
  - Render it between `<PriceSummary>` and `<PriceTable>` inside the main content area.

## Phase 4: Quality & Verification
- [ ] **Task 4.1**: Run `npx vitest run` to ensure all 23 existing + new tests pass.
- [ ] **Task 4.2**: Run `npx tsc --noEmit` to verify type correctness.

## Phase 5: SDD Archiving
- [ ] **Task 5.1**: Create `openspec/changes/recomendacion-electrodomesticos/verify-report.md`.
- [ ] **Task 5.2**: Create `openspec/changes/recomendacion-electrodomesticos/archive-report.md`.
- [ ] **Task 5.3**: Archive the change by moving all change artifacts to:
  `openspec/changes/archive/2026-06-24-recomendacion-electrodomesticos/`
