# Proposal: Selector de Tema Dark/Light & Cambio Dinámico

## Intent
Implementar un selector de tema Dark/Light interactivo, animado y responsivo en el Header, que permita alternar dinámicamente todo el diseño de la aplicación en tiempo real mediante la inyección de hojas de estilo de PrimeReact y clases de Tailwind CSS.

## Scope

### In Scope
- Eliminar la importación estática del tema oscuro en `src/main.tsx`.
- Refactorizar `src/App.tsx` para importar dinámicamente los estilos de Lara Dark y Lara Light de PrimeReact mediante el sufijo `?inline` de Vite.
- Implementar el estado global del tema (`theme: 'dark' | 'light'`) y sincronizarlo mediante un efecto para:
  - Alternar la clase `dark` en `document.documentElement`.
  - Actualizar los colores de fondo y texto de `document.body` de forma directa para evitar destellos (Dark: `#0b0f19`/`#f3f4f6`, Light: `#f8fafc`/`#0f172a`).
  - Inyectar el CSS del tema activo en una etiqueta `<style id="primereact-theme">` en el `<head>`.
- Refactorizar `src/components/Header.tsx` para aceptar el estado del tema y la función para alternarlo, construyendo un selector de tema premium, altamente interactivo, con forma de píldora y un deslizador animado que contenga íconos dinámicos de sol y luna con micro-animaciones.
- Actualizar estéticamente todos los componentes del dashboard (`App.tsx` [skeletons], `PriceSummary.tsx`, `PriceTable.tsx`, `ApplianceRecommendations.tsx`) con clases de Tailwind `dark:` para garantizar que se vean espectaculares en ambos modos.
  - **Light Mode**: Tarjetas con diseño de vidrio esmerilado translúcido (`bg-white/80 border-slate-200/80 backdrop-blur-md shadow-sm`), texto oscuro (`text-slate-800`/`text-slate-500`) y bordes nítidos.
  - **Dark Mode**: Mantener el aspecto oscuro profundo actual (`bg-slate-950/30 border-slate-800/60 backdrop-blur-md shadow-xl`) con texto claro.
- Garantizar la compatibilidad con el pipeline de calidad:
  - Sin errores de TypeScript (`npx tsc -b` o `npx tsc --noEmit`).
  - Todos los 37 tests unitarios/integración pasando de forma exitosa.
- Documentación completa en la carpeta de cambios y posterior archivado local sin commits ni pushes.

### Out of Scope
- Persistencia del tema en una base de datos externa (se usará estado local y, opcionalmente, localStorage si corresponde, pero respetando la especificación).
- Soporte para múltiples temas adicionales (ej. temas verdes, sepia, etc.).
- Modificación de la configuración de compilación de Vite fuera del uso de `?inline`.

## Capabilities

### New Capabilities
- `selector-tema-dark-light`: Capacidad de alternar dinámicamente el tema visual de la aplicación entre Light y Dark de forma fluida y consistente para todos los componentes de PrimeReact y Tailwind CSS.

### Modified Capabilities
- `dashboard-ui`: El dashboard pasa de ser estático y puramente oscuro a ser completamente responsivo al tema seleccionado.

## Approach
1. **Desacoplamiento del Tema Estático**: Remover la importación de `lara-dark-blue/theme.css` en `src/main.tsx`.
2. **Inyección de Estilos Dinámicos**: Implementar en `src/App.tsx` la importación dinámica con `?inline`, la etiqueta `<style id="primereact-theme">` en el `useEffect` y la sincronización del body y `documentElement`.
3. **Diseño del Selector Premium**: Rediseñar `src/components/Header.tsx` para incorporar el switch tipo píldora interactivo con transiciones de 300ms y 500ms, íconos animados (`pi pi-sun animate-spin-slow` y `pi pi-moon animate-pulse`) y efecto hover.
4. **Adaptación de Componentes (Glassmorphism)**: Ajustar meticulosamente `PriceSummary.tsx`, `PriceTable.tsx`, `ApplianceRecommendations.tsx` y los esqueletos de carga de `App.tsx` utilizando modificadores `dark:` de Tailwind, cuidando los contrastes, legibilidad de badges, textos y bordes.
5. **Calidad y Verificación**: Ejecutar verificaciones de tipo y linter, y correr la suite de pruebas unitarias para corroborar que ningún cambio rompa la lógica existente.
6. **Archivado**: Generar la especificación formal, el diseño técnico, las tareas detalladas, y posteriormente documentar la verificación e historial para archivar el cambio en la ruta indicada.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/main.tsx` | Modified | Eliminar importación de estilos de tema oscuro estáticos. |
| `src/App.tsx` | Modified | Importación dinámica con `?inline`, lógica de estado del tema, inyección de estilos, actualización de clases HTML/body, y paso de props al Header. |
| `src/components/Header.tsx` | Modified | Refactorización para aceptar props de tema, y maquetación del toggle animado premium. |
| `src/components/PriceSummary.tsx` | Modified | Añadir clases `dark:` para soporte de modo claro translúcido en tarjetas de estadísticas. |
| `src/components/ApplianceRecommendations.tsx` | Modified | Añadir clases `dark:` en tarjetas de electrodomésticos, semáforo energético y banners. |
| `src/components/PriceTable.tsx` | Modified | Añadir clases `dark:` para soporte del modo claro en la tabla de precios y sus dropdowns de filtrado. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Destello de tema (FOUC) al recargar | Low | Se establece un tema por defecto ('dark') en el estado y se sincroniza inmediatamente en el `useEffect`. La actualización directa del body asegura un renderizado inmediato. |
| Falta de contraste en Light Mode | Med | Se utilizarán colores del catálogo slate de Tailwind (`text-slate-800`, `text-slate-500`, etc.) y fondos claros opacos/translúcidos con blur (`bg-white/80 backdrop-blur-md`) para garantizar un ratio de contraste óptimo. |
| Incompatibilidad de PrimeReact con estilos en línea | Low | PrimeReact acepta perfectamente estilos inyectados en una etiqueta `<style>` ya que son reglas CSS estándar. El uso de `?inline` provisto por Vite es compatible y óptimo. |

## Rollback Plan
En caso de fallos graves, revertir los archivos modificados a su estado original utilizando `git checkout -- <file>` o `git reset --hard` al estado inicial del commit previo al cambio.

## Success Criteria
- [ ] Aplicación libre de errores de tipo (`npx tsc -b`) y linter.
- [ ] Todos los 37 tests de Vitest se ejecutan y aprueban exitosamente.
- [ ] El tema cambia en tiempo real al hacer clic en el switch del Header.
- [ ] El switch cuenta con micro-animaciones (giro suave en sol, pulso en luna) y transiciones altamente fluidas.
- [ ] Todos los componentes de la interfaz (tarjetas, tablas, botones, filtros, banners) adoptan un diseño premium glassmorphism en Light Mode y conservan su aspecto oscuro en Dark Mode.
- [ ] Documentos de SDD generados y archivados correctamente en la ruta local correspondiente.
