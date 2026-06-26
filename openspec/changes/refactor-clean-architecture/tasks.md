# Tasks: Refactor to Feature-Based Clean Architecture & Current Price Status Badge

Este documento detalla el plan de ejecución paso a paso para llevar a cabo la refactorización a Arquitectura Limpia y la implementación del badge de estado del precio actual en `PriceSummary.tsx`.

---

## Plan de Trabajo Modular

### Phase 1: Planning & Setup
- [ ] 1.1. Validar que el entorno de desarrollo compile correctamente antes de realizar cambios.
- [ ] 1.2. Asegurar que la suite de tests existente (`npm run test` o `vitest`) esté en verde.
- [ ] 1.3. Crear la estructura completa de directorios destino bajo `src/`:
  - `src/core/layout/`
  - `src/features/theme/components/`
  - `src/features/theme/hooks/`
  - `src/features/prices/components/`
  - `src/features/prices/hooks/`
  - `src/features/prices/services/`
  - `src/features/prices/utils/`
  - `src/features/appliances/components/`
  - `src/features/appliances/config/`
  - `src/features/appliances/utils/`

### Phase 2: Core Layout and Theme Migration
- [ ] 2.1. Mover `src/components/Header.tsx` a `src/core/layout/Header.tsx`.
- [ ] 2.2. Mover `src/components/Footer.tsx` a `src/core/layout/Footer.tsx`.
- [ ] 2.3. Mover `src/components/AnimatedBackground.tsx` a `src/features/theme/components/AnimatedBackground.tsx`.
- [ ] 2.4. Si existen hooks relacionados con el tema visual, migrarlos a `src/features/theme/hooks/`.
- [ ] 2.5. Actualizar los imports en estos tres ficheros para adaptarlos a sus nuevas ubicaciones.

### Phase 3: Prices Domain Migration
- [ ] 3.1. Mover el cliente API `src/services/reeApi.ts` a `src/features/prices/services/reeApi.ts`. Actualizar dependencias internas si las hubiera.
- [ ] 3.2. Mover `src/utils/priceCalculations.ts` a `src/features/prices/utils/priceCalculations.ts`.
- [ ] 3.3. Añadir la función `classifyPrice(price, averagePrice)` en `src/features/prices/utils/priceCalculations.ts` para categorizar si un precio es "cheap", "normal", o "expensive" según las reglas unificadas del 90% y 110%.
- [ ] 3.4. Crear el hook contenedor `src/features/prices/hooks/usePvpcData.ts` encapsulando el fetch de `reeApi`, el control de carga (`loading`), errores (`error`), caché local y los cálculos estadísticos delegados en `priceCalculations`.
- [ ] 3.5. Mover `src/components/PriceTable.tsx` a `src/features/prices/components/PriceTable.tsx` y refactorizarlo para que actúe únicamente como componente presentacional, adaptando sus imports.
- [ ] 3.6. Mover `src/components/PriceSummary.tsx` a `src/features/prices/components/PriceSummary.tsx`.
- [ ] 3.7. Refactorizar `PriceSummary.tsx` incorporando el Badge de estado dentro de la tarjeta de "Precio ahora". Usar la función `classifyPrice` para determinar la clasificación y aplicar las clases de color de Tailwind acordadas.

### Phase 4: Appliances Domain Migration
- [ ] 4.1. Migrar las configuraciones de electrodomésticos desde `src/utils/` o crear un archivo dedicado en `src/features/appliances/config/appliancesConfig.ts`.
- [ ] 4.2. Extraer o mover los algoritmos de cálculo de coste a `src/features/appliances/utils/applianceCalculations.ts`.
- [ ] 4.3. Mover `src/components/ApplianceRecommendations.tsx` a `src/features/appliances/components/ApplianceRecommendations.tsx`.
- [ ] 4.4. Refactorizar el componente para que consuma de forma limpia las utilidades del dominio de electrodomésticos y los datos de precios inyectados.

### Phase 5: App Integration & Cleanup
- [ ] 5.1. Actualizar `src/App.tsx` para importar los componentes de sus nuevas ubicaciones en `src/core/layout` y `src/features/`.
- [ ] 5.2. Sustituir la lógica de fetching inline de `App.tsx` mediante el uso del nuevo hook unificado `usePvpcData`.
- [ ] 5.3. Eliminar los directorios y archivos antiguos redundantes para evitar duplicados:
  - Eliminar la carpeta `src/components` vieja.
  - Eliminar la carpeta `src/services` vieja.
  - Eliminar la carpeta `src/utils` vieja.
- [ ] 5.4. Asegurar que no quedan imports huérfanos o referencias rotas.

### Phase 6: Test Migration and Verification
- [ ] 6.1. Reubicar los archivos de tests (`*.test.tsx`, `*.test.ts`, `*.spec.ts`) junto a sus respectivos componentes o módulos dentro de la estructura de características.
- [ ] 6.2. Actualizar los paths de importación en todos los archivos de tests reubicados.
- [ ] 6.3. Ejecutar la suite de pruebas completa con Vitest para confirmar que el 100% de los tests pasan sin errores.
- [ ] 6.4. Realizar una verificación manual de la interfaz de usuario, validando especialmente que el nuevo badge en la tarjeta "Precio ahora" se visualiza correctamente y cambia de color según el estado del mercado eléctrico.
