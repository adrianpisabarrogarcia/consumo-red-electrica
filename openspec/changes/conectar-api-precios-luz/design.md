# Design: Conectar API de Precios de Luz y Refactorización UI

This document details the technical design for integrating the Red Eléctrica de España (REE) public API, implementing daily price calculations with full unit test coverage, and refactoring the user interface to a modern minimalist dark theme. It also covers production build fixes and the design for column-level table filtering.

---

## Technical Approach

The implementation follows a modular, type-safe, and test-driven approach:
1. **Testing Infrastructure**: Install Vitest and configure it in `vite.config.ts`.
2. **Business Logic (TDD)**: Define pure math functions in `src/utils/priceCalculations.ts` to compute statistics (average, cheapest hour, current price, best interval). Write comprehensive unit tests in `src/utils/priceCalculations.test.ts` first, then implement the logic to satisfy them.
3. **API Integration**: Create `src/services/reeApi.ts` to fetch daily PVPC prices from `apidatos.ree.es` with a local storage caching layer to prevent redundant API requests.
4. **UI Refactoring**: Convert `PriceSummary.tsx` and `PriceTable.tsx` from React class components to modern functional components using React 19 hooks, styling them with Tailwind CSS v4 and a dark PrimeReact theme.
5. **Build Consolidation & Table Filtering**: Address production compilation issues by exporting internal interfaces and aligning Vitest config imports, while implementing state-driven column filtering on the PrimeReact `DataTable` using native filters and custom UI templates.

---

## Architecture Decisions

The following architectural choices have been made to align with modern React 19 standards and the project's requirements:

### Component Architecture
| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **Class Components** | Outdated React pattern, verbose, lacks hook integration. | **Reject** |
| **Functional Components** | Modern React standard, highly composable, simpler state management via hooks. | **Adopt** (React 19 native) |

### API Fetch & Caching
| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **React Query / Axios** | High dependency overhead and bundle size for a simple daily query. | **Reject** |
| **Native Fetch + LocalStorage** | Zero-dependency, lightweight, easily cached by date keys. | **Adopt** |

### Testing Framework
| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **Jest** | Complex configuration with Vite/ESM, slower execution. | **Reject** |
| **Vitest** | Native Vite integration, zero-config, extremely fast ESM execution. | **Adopt** |

### UI Styling & Theme
| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **PrimeReact Default Light Theme** | Visual aesthetics look basic and generic; does not match dark mode design. | **Reject** |
| **Tailwind v4 + PrimeReact Dark Theme** | Sleek, custom dark theme with Outfit typography and Lara Dark Blue. | **Adopt** |

### Table Filtering
| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **Custom Filter Logic** | Requires manual state synchronization, custom filtering functions, and complex row rendering logic. | **Reject** |
| **PrimeReact DataTable Built-in Filters** | Out-of-the-box support for column filtering, state-driven via the `filters` prop, supports custom match modes, and accepts custom UI templates (e.g., Dropdown, InputText) for filters. | **Adopt** |

---

## Data Flow

Data is fetched, cached, and distributed through the application via a unidirectional flow:

```
[ REE API (apidatos.ree.es) ]
             │
             ▼ (HTTP GET / fetch on cache miss)
[ src/services/reeApi.ts ] ◄──► [ localStorage Cache (pvpc-YYYY-MM-DD) ]
             │
             ▼ (parsed HourlyPrice[] array)
[ React State in src/App.tsx ]
             │
             ├───► [ src/components/PriceSummary.tsx ] (renders daily stats cards)
             │
             └───► [ src/components/PriceTable.tsx ] (renders hourly DataTable with filters)
```

---

## File Changes

| File | Action | Description |
| :--- | :--- | :--- |
| `package.json` | Modify | Add `vitest` and `@vitest/coverage-v8` to devDependencies and a `test` execution script. |
| `vite.config.ts` | Modify | Add `test` configuration for Vitest, importing `defineConfig` from `'vitest/config'` to prevent production build compilation issues. |
| `src/services/reeApi.ts` | Create | PVPC API client with local storage daily caching. |
| `src/utils/priceCalculations.ts` | Create | Create and explicitly export pure functions and interfaces (including `PriceStats` and `HourlyPrice`) for statistics. |
| `src/utils/priceCalculations.test.ts` | Create | Comprehensive unit tests for all mathematical utility functions. |
| `src/App.tsx` | Modify | Orchestrate state (prices, loading, error) and fetch trigger on mount. |
| `src/components/PriceSummary.tsx` | Modify | Refactor to functional component, compute stats, and style cards. |
| `src/components/PriceTable.tsx` | Modify | Refactor to functional component, render DataTable with rating badges, and implement native column filtering (hour, price, tariff status) with custom UI templates. |
| `src/App.css` | Modify | Switch to `lara-dark-blue` theme, import Google Fonts, and define dark styles. |
| `index.html` | Modify | Add Google Font link for the `Outfit` typography. |

---

## Interfaces / Contracts

### REE API Raw Response
```typescript
export interface ReeApiValue {
  value: number;       // Price in €/MWh (e.g., 133.2)
  datetime: string;    // ISO 8601 string (e.g., "2026-06-24T00:00:00.000+02:00")
}

export interface ReeApiSeries {
  type: string;
  id: string;
  attributes: {
    title: string;
    values: ReeApiValue[];
  };
}

export interface ReeApiResponse {
  included: ReeApiSeries[];
}
```

### Application Model
```typescript
export interface HourlyPrice {
  hour: number;        // 0 to 23
  price: number;       // Price in €/kWh (e.g., 0.1332)
  datetime: string;    // Original ISO string
}

// Explicitly exported to allow integration in other UI components and resolve build errors
export interface PriceStats {
  averagePrice: number;
  cheapestHour: { hour: number; price: number } | null;
  currentPrice: number | null;
  bestInterval: { startHour: number; endHour: number; averagePrice: number } | null;
}
```

---

## Table Filtering & Sorting Design

The column-level filtering and sorting in the `PriceTable` component leverages PrimeReact `DataTable`'s native APIs.

### State and Configuration

1. **Filter State**:
   Managed using React state with the `DataTableFilterMeta` type from PrimeReact:
   ```typescript
   import { FilterMatchMode } from 'primereact/api';
   
   const [filters, setFilters] = useState<DataTableFilterMeta>({
     hourStr: { value: null, matchMode: FilterMatchMode.EQUALS },
     status: { value: null, matchMode: FilterMatchMode.EQUALS }
   });
   ```
   *Note: Since the hour in the table is selected from a predefined list of 24 hourly intervals (e.g., "12:00 - 13:00"), `FilterMatchMode.EQUALS` is used to match the exact string slot.*

2. **Custom Filter Templates**:
   - **Hour Filter**: A PrimeReact `Dropdown` containing the 24 formatted hourly ranges ('00:00 - 01:00' to '23:00 - 24:00'), a placeholder "Todos", and `showClear={true}`.
   - **Price Column**: Does NOT have a text or numeric filter input. Instead, sorting is enabled to allow quick comparison.
   - **Tariff Status Filter**: A PrimeReact `Dropdown` selector containing the status options (`['Barata', 'Normal', 'Cara']`).

3. **Sorting**:
   - **Hour Column**: Configured with `sortable={true}` to sort chronologically.
   - **Price Column**: Configured with `sortable={true}` to sort by numeric cost value (ascending and descending).
   - **Tariff Status Column**: Configured with `sortable={true}` for consistent sorting across all columns.

4. **DataTable Integration**:
   ```jsx
   <DataTable 
     value={processedPrices} 
     filters={filters} 
     onFilter={(e) => setFilters(e.filters)} 
     filterDisplay="row"
     // other props...
   >
     <Column field="hourStr" header="Hora" sortable filter filterElement={hourFilterElement} showFilterMenu={false} />
     <Column field="price" header="Precio" sortable />
     <Column field="status" header="Estado / Tarifa" sortable filter filterElement={statusFilterElement} showFilterMenu={false} />
   </DataTable>
   ```

---

## Testing Strategy

| Layer | What to Test | Approach |
| :--- | :--- | :--- |
| **Unit** | `src/utils/priceCalculations.ts` | Test pure functions with standard, empty, single, and boundary inputs using Vitest. |
| **Unit** | `src/services/reeApi.ts` | Mock `fetch` and `localStorage` to verify API calls and cache hits/misses. |
| **Coverage** | Total codebase coverage | Use `@vitest/coverage-v8` to measure and report statement, branch, and line coverage during testing. |

---

## Migration / Rollout

No migration required. All state is client-side and cached in `localStorage`, which will auto-populate on first load.

---

## Open Questions

- None. The design is fully aligned with the requirements and specifications.

