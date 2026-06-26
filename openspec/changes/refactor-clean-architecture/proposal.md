# Proposal: Refactor to Feature-Based Clean Architecture & Current Price Status Badge

Este documento detalla la propuesta técnica para realizar una refactorización estructural profunda del proyecto hacia una **Arquitectura Limpia Orientada a Características (Feature-Based Clean Architecture)**, incorporando principios SOLID y el patrón **Contenedor-Presentacional**. Adicionalmente, se detalla la implementación de una nueva característica: un badge de estado del precio actual en la tarjeta "Precio ahora".

---

## 1. Objetivos del Cambio

### A. Refactorización a Arquitectura Limpia y SOLID
El diseño actual mezcla responsabilidades en componentes sobredimensionados y expone lógica de negocio y llamadas a APIs directamente dentro de la UI. Proponemos migrar a una estructura modular basada en características ("features"), donde:
1. **Separación de Responsabilidades (SRP):** Cada archivo/componente tendrá un único propósito bien definido.
2. **Patrón Contenedor-Presentacional:**
   - **Contenedores/Hooks:** Manejan el estado, efectos de carga, llamadas a servicios y caché (`usePvpcData`).
   - **Presentacionales:** Componentes puros de React enfocados en la renderización visual (`PriceSummary`, `PriceTable`, `ApplianceRecommendations`).
3. **Inversión de Dependencias (DIP):** Los componentes no dependerán de detalles de implementación de red o cálculos crudos. Dependerán de abstracciones de servicios (`services/reeApi`) y utilidades puras (`utils/priceCalculations`).
4. **Arquitectura Limpia:** Organización en capas de infraestructura, dominio y presentación por dominio de negocio (Precios, Electrodomésticos, Tema, Layout Core).

### B. Característica: Badge de Estado en "Precio ahora"
Añadir una insignia (badge) visual en la tarjeta de "Precio ahora" dentro de `PriceSummary.tsx`. Esta insignia clasificará dinámicamente el precio actual en tres niveles en comparación con la media diaria, utilizando exactamente las mismas reglas y estilos visuales presentes en la tabla de precios:
- **Barata:** El precio actual es inferior al 90% de la media diaria ($< 0.9 \times \text{media}$).
- **Normal:** El precio está entre el 90% y el 110% de la media diaria ($[0.9 \times \text{media}, 1.1 \times \text{media}]$).
- **Cara:** El precio actual es superior al 110% de la media diaria ($> 1.1 \times \text{media}$).

---

## 2. Enfoque Arquitectónico (Estructura de Carpetas)

Migraremos el código monolítico estructurado por tipos técnicos (`components/`, `services/`, `utils/`) a un diseño **Screaming Architecture** basado en características:

```text
src/
├── core/
│   └── layout/                        # Componentes globales de layout estructural
│       ├── Header.tsx
│       └── Footer.tsx
├── features/
│   ├── theme/                         # Dominio de UI global, fondo y tema
│   │   ├── components/
│   │   │   └── AnimatedBackground.tsx
│   │   └── hooks/
│   │       └── useTheme.ts            # Si existiera lógica de tema extraída
│   ├── prices/                        # Dominio de Precios PVPC
│   │   ├── components/
│   │   │   ├── PriceSummary.tsx       # Presentacional (recibe stats)
│   │   │   └── PriceTable.tsx         # Presentacional (recibe listado de precios y stats)
│   │   ├── hooks/
│   │   │   └── usePvpcData.ts         # Contenedor (maneja fetch, estado, cache de precios)
│   │   ├── services/
│   │   │   └── reeApi.ts              # Cliente HTTP para red eléctrica
│   │   └── utils/
│   │       └── priceCalculations.ts   # Funciones puras de cálculo de estadísticas
│   └── appliances/                    # Dominio de Electrodomésticos y consumo
│       ├── components/
│       │   └── ApplianceRecommendations.tsx # Presentacional (recibe stats y config)
│       ├── config/
│       │   └── appliancesConfig.ts    # Configuración estática de electrodomésticos
│       └── utils/
│           └── applianceCalculations.ts # Funciones puras de coste de electrodomésticos
├── App.tsx                            # Orquestador principal de la aplicación
└── main.tsx                           # Punto de entrada de la aplicación
```

---

## 3. Lógica del Badge de Precio Actual

Para mantener consistencia, la lógica de cálculo y asignación de clases CSS del badge se centralizará o alineará con la de la tabla de precios:

### Reglas de Negocio
```typescript
export type PriceClassification = "cheap" | "normal" | "expensive";

export const classifyPrice = (price: number, averagePrice: number): PriceClassification => {
  if (price < averagePrice * 0.9) return "cheap";
  if (price > averagePrice * 1.1) return "expensive";
  return "normal";
};
```

### Estilos Visuales (Tailwind CSS)
- **Barata (cheap):** Fondo verde suave (`bg-emerald-50 dark:bg-emerald-950/30`), texto verde (`text-emerald-700 dark:text-emerald-400`), borde (`border-emerald-200 dark:border-emerald-800/30`).
- **Normal (normal):** Fondo ámbar/azul suave (`bg-blue-50 dark:bg-blue-950/30`), texto azul/gris (`text-blue-700 dark:text-blue-400`), borde (`border-blue-200 dark:border-blue-800/30`).
- **Cara (expensive):** Fondo rojo suave (`bg-rose-50 dark:bg-rose-950/30`), texto rojo (`text-rose-700 dark:text-rose-400`), borde (`border-rose-200 dark:border-rose-800/30`).

---

## 4. Análisis de Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| **Rotura de Imports en la Aplicación** | Alto | Realizar la migración de forma incremental por dominios de negocio. Actualizar `App.tsx` en paralelo con la migración de cada característica. |
| **Pérdida de Cobertura / Fallo de Tests** | Alto | Mantener los tests existentes funcionando. Reubicar los ficheros de test (`*.test.tsx` o `*.spec.ts`) junto a sus respectivos componentes o utilidades dentro de las nuevas subcarpetas de características y ejecutar Vitest de forma continua. |
| **Inconsistencias en el Estado Global** | Medio | Al encapsular el fetch y almacenamiento de datos PVPC en el hook `usePvpcData`, se asegura una única fuente de verdad y se evitan lecturas redundantes o estados desalineados. |
| **Caché Obsoleta de la API** | Bajo | El hook `usePvpcData` implementará almacenamiento en caché (por ejemplo, en `localStorage` o en estado de React referenciado a la fecha actual) para evitar llamadas excesivas a la API de Red Eléctrica de España. |
