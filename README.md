# Consumo Red Eléctrica España 🇪🇸

Aplicación web premium y responsiva para consultar y optimizar los precios del consumo eléctrico en España (tarifa regulada PVPC) en tiempo real, conectada a la API oficial de Red Eléctrica de España.

---

## 📋 Características y Funcionalidades

La aplicación fue desarrollada siguiendo los principios de **Clean Architecture**, **TDD (Test-Driven Development)** y **SDD (Spec-Driven Development)**, ofreciendo una experiencia de usuario fluida y de alta calidad visual:

*   **⚡ Conexión en Tiempo Real con la API de REE:** Conexión directa con la API oficial de Red Eléctrica de España para obtener los precios PVPC del día actual.
*   **💾 Caché Inteligente Local (`localStorage`):** Capa de servicio que almacena en caché diaria los precios del día para evitar llamadas de red redundantes y tasas de límite de la API, logrando cargas instantáneas.
*   **📊 Panel Estadístico de Precios:** Tarjetas de resumen que muestran:
    *   El **Precio Ahora** (precio actual en tiempo real).
    *   La **Hora más barata** (el tramo de menor coste del día).
    *   El **Precio medio del día** (media aritmética diaria).
    *   La **Mejor Franja (1 hora)** (el tramo contiguo de 1 hora con menor precio medio ideal para programar consumos cortos).
*   **🧺 Recomendador Inteligente de Electrodomésticos:** Algoritmos que buscan el tramo de menor coste del día específico para la duración de cada aparato:
    *   *Lavadora* (2h), *Lavavajillas* (2h), *Horno* (1h), *Termo Eléctrico* (3h) y *Aire Acondicionado* (4h).
    *   Cálculo en tiempo real del **porcentaje de ahorro estimado** frente a la hora pico (precio máximo).
    *   **Semáforo Energético:** Clasificación visual rápida en tarjetas de las horas más baratas (recomendadas) y horas caras (a evitar) del día.
*   **🔍 Tabla Interactiva con Filtros Reactivos:** Desglose de las 24 horas del día mediante una `DataTable` de PrimeReact que incluye:
    *   Ordenamiento por columnas.
    *   Filtro rápido interactivo por tramo horario.
    *   Filtro por tipo de tarifa (Barata, Normal, Cara) calculado dinámicamente según el precio medio del día.
    *   Diseño responsivo que oculta columnas decorativas en móviles para evitar barras de desplazamiento horizontal en pantallas desde 320px.
*   **🌓 Selector Premium de Temas (Claro/Oscuro):** Toggle dinámico e interactivo en el Header (animación del sol girando y la luna latiendo) con **persistencia automática en `localStorage`** para recordar la preferencia del usuario entre recargas.
*   **🌌 Fondo Interactivo de Estrellas (Canvas):** Simulación de partículas (95 estrellas flotantes) que reaccionan de manera fluida mediante **físicas de atracción gravitacional** (siguen al cursor) y **barrido por velocidad de movimiento (Velocity Sweep)**, simulando una estela de cometa interactiva.
*   **📜 Scrollbar Premium:** Barra de desplazamiento minimalista personalizada con track transparente para permitir que las estrellas del fondo se deslicen por debajo, y un tirador que brilla en color índigo al pasar el mouse.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre cimientos modernos y robustos:

*   **React 19** (Framework de interfaz de usuario de última generación)
*   **TypeScript** (Tipado estático seguro)
*   **Vite** (Herramienta ultra rápida de desarrollo y empaquetado)
*   **Tailwind CSS v4** (Diseño responsivo mediante clases utilitarias y variables CSS nativas)
*   **PrimeReact** (Biblioteca de componentes enriquecida: DataTable, Dropdown, Skeleton)
*   **Vitest** (Suite de pruebas unitarias integradas y de alto rendimiento)
*   **OpenSpec (Spec-Driven Development)** (Planificación y especificación rigurosa de comportamiento de software)

---

## 📁 Estructura del Proyecto

La arquitectura del código está estructurada de manera limpia y modular:

```text
consumo-red-electrica/
├── .atl/                               # Registros de habilidades de IA del proyecto
├── openspec/                           # Especificaciones formales del software (SDD)
│   ├── config.yaml                     # Configuración de SDD y testing
│   ├── specs/                          # Especificaciones funcionales por dominio
│   │   ├── api-precios-luz/
│   │   ├── calculo-estadisticas-precios/
│   │   ├── recomendacion-electrodomesticos/
│   │   └── selector-tema-dark-light/
│   └── changes/                        # Propuestas de cambio técnicas archivadas
│       └── archive/                    # Historial de cambios implementados y verificados
├── src/
│   ├── components/                     # Componentes de presentación y UI
│   │   ├── AnimatedBackground.tsx      # Lienzo interactivo de partículas físicas
│   │   ├── ApplianceRecommendations.tsx # Recomendador de electrodomésticos y semáforo
│   │   ├── PriceSummary.tsx            # Tarjetas de estadísticas y banners
│   │   ├── PriceTable.tsx              # Tabla de precios con DataTable y filtros
│   │   ├── Header.tsx                  # Encabezado con switch de tema premium
│   │   └── Footer.tsx                  # Pie de página responsivo
│   ├── services/                       # Capa de servicios e integración de red
│   │   ├── reeApi.ts                   # Cliente API de REE con lógica de caché
│   │   └── reeApi.test.ts              # Pruebas de integración y mocks de API/Caché
│   ├── utils/                          # Utilidades lógicas puras y matemáticas
│   │   ├── priceCalculations.ts        # Algoritmos de cálculo estadístico y óptimo
│   │   ├── priceCalculations.test.ts   # Pruebas unitarias de algoritmos matemáticos
│   │   └── applianceRecommendations.test.ts # Pruebas unitarias de tramos de electrodomésticos
│   ├── App.css                         # CSS global, scrollbar y configuración de Tailwind v4
│   ├── App.tsx                         # Orquestador de estado, carga y sincronización de tema
│   ├── main.tsx                        # Punto de entrada de la aplicación React
│   └── vite-env.d.ts                   # Declaración de tipos de Vite
├── package.json                        # Dependencias y scripts de ejecución
├── tsconfig.json                       # Configuración del compilador TypeScript
└── vite.config.ts                      # Configuración de Vite y Vitest
```

---

## 📦 Instalación y Configuración

### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y el gestor de paquetes [pnpm](https://pnpm.io/).

```bash
# 1. Clonar el repositorio
git clone https://github.com/adrianpisabarrogarcia/consumo-red-electrica.git
cd consumo-red-electrica

# 2. Instalar las dependencias del proyecto
pnpm install
```

---

## 🛠️ Guía de Ejecución y Comandos

Durante el desarrollo, puedes ejecutar los siguientes scripts de npm/pnpm:

```bash
# Iniciar el servidor de desarrollo local (Vite con recarga rápida en caliente)
pnpm dev

# Ejecutar la suite completa de pruebas unitarias con Vitest de forma interactiva
pnpm test

# Ejecutar los tests una sola vez (ideal para CI/CD)
npx vitest run

# Validar el tipado estático del proyecto con el compilador de TypeScript
npx tsc --noEmit

# Ejecutar el análisis de calidad de código con ESLint
pnpm lint

# Compilar la aplicación optimizada para producción en la carpeta dist/
pnpm build

# Previsualizar localmente la build de producción compilada
pnpm preview
```

---

## 📊 Pruebas Unitarias y Calidad de Software

El proyecto cuenta con una cobertura de pruebas unitarias robusta que valida de forma matemática la exactitud del cálculo de precios, los tramos ideales para los electrodomésticos y el correcto funcionamiento del almacenamiento en caché de la API:

*   **`priceCalculations.test.ts`**: Pruebas de promedio diario, hora mínima, precio actual y mejor bloque contiguo de 1 hora (incluyendo manejo de datos vacíos, límites de horas y ordenamientos).
*   **`applianceRecommendations.test.ts`**: Pruebas de búsqueda de franja óptima para electrodomésticos de duraciones variadas y cálculo de porcentajes de ahorro frente a valores pico.
*   **`reeApi.test.ts`**: Mocking del objeto global `fetch` y `localStorage` para asegurar que las llamadas de red se realicen únicamente cuando no hay datos en caché, validando también el control de errores en caso de caída del servidor externo de REE.

---

## 🤝 Contribuciones

Las ideas son bienvenidas. Si querés proponer mejoras visuales, optimizaciones de algoritmos o nuevas características:
1. Hacé un fork del proyecto.
2. Creá tu rama de funcionalidad (`git checkout -b feature/mi-mejora`).
3. Realizá tus commits usando el formato de commits convencionales.
4. Subí los cambios a tu rama (`git push origin feature/mi-mejora`).
5. Abrí un Pull Request para revisión.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Libre para uso personal y comercial.