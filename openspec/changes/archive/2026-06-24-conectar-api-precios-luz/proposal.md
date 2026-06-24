# Proposal: Conectar API de Precios de Luz y Refactorización UI

## Intent
Conectar la aplicación a la API pública de Red Eléctrica de España (REE) para obtener y visualizar precios de luz reales en tiempo real, reemplazando datos mock, e implementar infraestructura de pruebas unitarias.

## Scope

### In Scope
- Instalar `vitest` y configurar entorno de pruebas unitarias en Vite.
- Implementar `src/services/reeApi.ts` para obtener precios diarios con caché en `localStorage`.
- Implementar `src/utils/priceCalculations.ts` con funciones matemáticas puras para estadísticas de precios.
- Implementar tests unitarios exhaustivos paso a paso para las utilidades de cálculo.
- Refactorizar `PriceSummary.tsx` y `PriceTable.tsx` a componentes funcionales modernos usando React 19 y PrimeReact.
- Rediseñar la UI a un estilo minimalista, moderno, con tema oscuro pulido y tipografía elegante mediante Tailwind CSS v4.
- Flujo Git: Commits convencionales después de cada hito sin atribución de IA.

### Out of Scope
- Soporte para múltiples tarifas históricas de años anteriores (solo día actual/siguiente).
- Backend propio para proxy de API.

## Capabilities

### New Capabilities
- `api-precios-luz`: Servicio de consulta a la API de REE para el PVPC diario con almacenamiento local caché.
- `calculo-estadisticas-precios`: Utilidades de cálculo matemático puro con cobertura de tests unitarios al 100%.
- `entorno-testing-vitest`: Configuración de Vitest en el proyecto para soporte de TDD.

### Modified Capabilities
- None

## Approach
1. **Infraestructura**: Instalar `vitest` y añadir script `test` en `package.json`.
2. **Core y TDD**: Escribir especificaciones de cálculo, tests unitarios en `src/utils/priceCalculations.test.ts` y luego implementar `src/utils/priceCalculations.ts` para superarlos (TDD).
3. **Servicio API**: Crear `src/services/reeApi.ts` consumiendo `apidatos.ree.es` con caché diario en `localStorage`.
4. **UI Refactor**: Convertir componentes de clase a funcionales. Enlazar datos de la API y aplicar un diseño minimalista oscuro, espaciado amplio y tipografía refinada con Tailwind v4 y PrimeReact DataTable.
5. **Git**: Commits granulares con formato convencional y push por hito.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Añadir `vitest` en devDependencies y script de test. |
| `vite.config.ts` | Modified | Configurar entorno de Vitest. |
| `src/services/reeApi.ts` | New | Servicio de integración con REE API y caché. |
| `src/utils/priceCalculations.ts` | New | Funciones puras de cálculo matemático de estadísticas. |
| `src/utils/priceCalculations.test.ts` | New | Pruebas unitarias para las funciones de cálculo. |
| `src/components/PriceSummary.tsx` | Modified | Conversión a componente funcional, integración de datos y rediseño UI. |
| `src/components/PriceTable.tsx` | Modified | Conversión a componente funcional, uso de DataTable real y rediseño UI. |
| `src/App.tsx` | Modified | Integración del estado global de precios y manejo de carga/errores. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CORS en la API de REE | Med | Usar la API pública de datos abiertos de REE (`apidatos.ree.es`) que soporta CORS, o configurar proxy si es necesario. |
| React 19 incompatible con test | Low | Usar versiones recientes de Vitest compatibles nativamente con React 19. |
| Caída o lentitud de la API | Med | Implementar caché robusto en `localStorage` y UI con estados elegantes de error/carga. |

## Rollback Plan
Revertir cambios mediante Git (`git reset --hard`) al commit previo al inicio del cambio. Las dependencias instaladas se eliminan borrando `node_modules` y reinstalando con `pnpm install`.

## Dependencies
- API de Datos Abiertos de REE (`apidatos.ree.es`).
- `vitest` como entorno de ejecución de pruebas.

## Success Criteria
- [ ] Vitest configurado y ejecutando pruebas unitarias.
- [ ] Cobertura de tests unitarios del 100% en utilidades de cálculo de precios.
- [ ] Datos horarios obtenidos en tiempo real de REE y cacheados localmente.
- [ ] Tabla de PrimeReact mostrando las 24 horas del día con precios reales.
- [ ] Tarjetas de resumen mostrando estadísticas reales y mejor franja horaria.
- [ ] UI adaptada a tema oscuro minimalista moderno sin elementos por defecto genéricos.
- [ ] Historial de commits convencional limpio y sin atribución de IA.
