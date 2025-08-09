# Consumo Red Eléctrica España

Aplicación web para consultar los precios del consumo eléctrico en España en tiempo real.

## 📋 Descripción

Esta aplicación muestra los precios de la electricidad en España, permitiendo a los usuarios:
- Ver los precios actuales por hora en €/kWh
- Identificar las franjas horarias más económicas
- Obtener recomendaciones sobre cuándo consumir electricidad

## 🚀 Tecnologías

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de desarrollo y build
- **Tailwind CSS** - Framework de estilos
- **ESLint** - Linter de código

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd consumo-red-electrica

# Instalar dependencias
pnpm install
```

## 🛠️ Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Previsualizar build de producción
pnpm preview

# Ejecutar linter
pnpm lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Header.tsx          # Cabecera de la aplicación
│   ├── PriceSummary.tsx    # Resumen de precios y recomendaciones
│   ├── PriceTable.tsx      # Tabla de precios por horas
│   └── Footer.tsx          # Pie de página
├── App.tsx                 # Componente principal
└── main.tsx               # Punto de entrada
```

## 🔧 Configuración

El proyecto incluye configuración para:
- **TypeScript** - Tipado estático
- **ESLint** - Linting de código
- **Tailwind CSS** - Estilos utilitarios
- **PostCSS** - Procesamiento de CSS

## 📊 Funcionalidades

- ✅ Visualización de precios eléctricos por horas
- ✅ Identificación de franjas horarias económicas
- ✅ Interfaz responsive con Tailwind CSS
- 🔄 Datos en tiempo real (en desarrollo)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## URL de la API
La aplicación consume datos de la API oficial de Red Eléctrica de España (REE):
- [API REE](https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=2025-08-09T00:00&end_date=2025-08-09T23:59&time_trunc=hour)
- [Documentación de la API](https://www.ree.es/es/datos/apidatos)