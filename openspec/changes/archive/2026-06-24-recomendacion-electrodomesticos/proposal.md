# Proposal: Appliance Consumption Recommendation Module

## Intent
Implement a new dashboard module that analyzes daily PVPC electricity prices to recommend the best hours to run typical high-consumption household appliances. This will empower users to shift their consumption to cheaper hours and reduce their electricity bills.

## Scope

### In Scope
- **Mathematical Algorithm (TDD)**: Implement a pure mathematical utility module with two key functions:
  - `findBestWindowForAppliance`: Finds the consecutive window of `durationHours` with the lowest average price.
  - `categorizeHours`: Categorizes all 24 hours into 'cheap' (< 90% of average), 'expensive' (> 110% of average), and 'normal' (between 90% and 110%).
- **Comprehensive Unit Testing**: Write 100% covered unit tests for both functions covering happy paths, empty arrays, edge cases, and window boundary limits.
- **UI Component (`ApplianceRecommendations.tsx`)**: Build a modern, premium, minimalist dark-themed React component using PrimeReact icons and Tailwind CSS v4.
- **Integration**: Insert the component in `src/App.tsx` between the Price Summary and Price Table.
- **Local SDD Lifecycle**: Complete proposal, specs, design, tasks, implementation, verification, and archiving.

### Out of Scope
- Multi-day price history analysis (only daily PVPC prices for today are analyzed).
- User customization of appliances, custom durations, or custom icons.
- Push notifications or scheduling integrations with actual smart appliances.

## Capabilities

### New Capabilities
- `recomendacion-electrodomesticos`: Provides mathematical calculations and UI components for calculating and displaying optimal appliance usage hours and daily electricity price categorization.

### Modified Capabilities
- None

## Approach
1. **Spec & Design**: Define the formal specifications and architectural design.
2. **TDD Core Implementation**:
   - Write tests for `findBestWindowForAppliance` and `categorizeHours` in `src/utils/applianceRecommendations.test.ts`.
   - Implement the functions in `src/utils/applianceRecommendations.ts` to make the tests pass.
3. **UI Component Development**:
   - Create `src/components/ApplianceRecommendations.tsx` with a modern dark card layout.
   - Section 1 displays cards for Lavadora (2h), Lavavajillas (2h), Horno (1h), and Termo Eléctrico (3h) with recommended slots, average prices, and savings percentage compared to the day's peak hour.
   - Section 2 displays the green/red hourly groups (Semáforo Energético) and a practical advice banner.
4. **Integration**: Import and render the component in `src/App.tsx`.
5. **Verification**: Run `npx vitest run` and `npx tsc --noEmit` to ensure all tests pass and there are no compilation errors.
6. **Archive**: Move the SDD artifacts to the archived changes folder and write the final reports.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/utils/applianceRecommendations.ts` | New | Pure functions for best-window calculations and hourly categorization. |
| `src/utils/applianceRecommendations.test.ts` | New | Comprehensive unit tests for the recommendation utilities. |
| `src/components/ApplianceRecommendations.tsx` | New | UI component for displaying recommendations and the price traffic light. |
| `src/App.tsx` | Modified | Integration of the new component into the main dashboard view. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Duration greater than price array size | Low | Return `null` or handle gracefully in the algorithm with explicit test cases. |
| Zero or negative duration requested | Low | Handle gracefully by returning `null` or treating as 0-length window. |
| Non-contiguous price hour indices | Low | Assume sorted array of 24 hours, but write algorithm to work on array indices safely. |

## Rollback Plan
Discard changes using git checkout/reset for modified files and delete the newly created files:
- `src/utils/applianceRecommendations.ts`
- `src/utils/applianceRecommendations.test.ts`
- `src/components/ApplianceRecommendations.tsx`

## Dependencies
- PrimeReact and PrimeIcons (already installed in project).
- Tailwind CSS v4 (already configured in project).

## Success Criteria
- [ ] Comprehensive unit tests written and passing.
- [ ] Zero TypeScript compilation errors when running `npx tsc --noEmit`.
- [ ] UI component fits the dashboard's design.
- [ ] All 23 existing tests plus new tests pass.
- [ ] Change is archived under `openspec/changes/archive/2026-06-24-recomendacion-electrodomesticos/`.
