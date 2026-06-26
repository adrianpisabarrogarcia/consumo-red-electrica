import React from "react";
import { type PriceStats, classifyPrice } from "../utils/priceCalculations";

interface PriceSummaryProps {
  stats: PriceStats;
}

const formatHourSlot = (hour: number) => {
  const start = String(hour).padStart(2, "0");
  const end = String((hour + 1) % 24).padStart(2, "0");
  return `${start}:00 - ${end}:00`;
};

const badgeStyles = {
  cheap: {
    label: "Barata",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30",
    dotClass: "bg-emerald-500",
  },
  normal: {
    label: "Normal",
    class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30",
    dotClass: "bg-amber-500",
  },
  expensive: {
    label: "Cara",
    class: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/30",
    dotClass: "bg-rose-500",
  },
};

export const PriceSummary: React.FC<PriceSummaryProps> = ({ stats }) => {
  const { averagePrice, cheapestHour, currentPrice, bestInterval } = stats;

  const priceNowStr = currentPrice !== null ? `${currentPrice.toFixed(3)} €/kWh` : "N/A";
  
  const cheapestHourStr = cheapestHour
    ? `${formatHourSlot(cheapestHour.hour)}`
    : "N/A";
  const cheapestPriceStr = cheapestHour
    ? `${cheapestHour.price.toFixed(3)} €/kWh`
    : "N/A";

  const averagePriceStr = `${averagePrice.toFixed(3)} €/kWh`;

  const bestIntervalStr = bestInterval
    ? `${formatHourSlot(bestInterval.startHour)}`
    : "N/A";
  const bestIntervalPriceStr = bestInterval
    ? `${bestInterval.averagePrice.toFixed(3)} €/kWh`
    : "N/A";

  // Calculate the price classification if both currentPrice and averagePrice are available
  const classification =
    currentPrice !== null && averagePrice !== null
      ? classifyPrice(currentPrice, averagePrice)
      : null;

  return (
    <section className="space-y-6">
      {/* Informational Banner */}
      <div className="flex items-center justify-center p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-slate-700 dark:text-slate-100 text-sm gap-2 backdrop-blur-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-600 dark:text-indigo-400 shrink-0"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 9h.01" />
          <path d="M11 12h1v4h1" />
        </svg>
        <span>
          Los precios mostrados están en <strong>€/kWh</strong>. La mejor franja recomendada se calcula buscando el tramo contiguo de 1 hora con menor precio medio.
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Precio Ahora */}
        <div className="bg-white dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="pi pi-clock text-indigo-600 dark:text-indigo-400"></span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Precio ahora</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2 gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{priceNowStr}</span>
            {classification && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles[classification].class}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${badgeStyles[classification].dotClass}`} />
                {badgeStyles[classification].label}
              </span>
            )}
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Hora actual</span>
          </div>
        </div>

        {/* Card 2: Hora más barata */}
        <div className="bg-white dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="pi pi-arrow-down-circle text-emerald-600 dark:text-emerald-400"></span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Hora más barata</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{cheapestHourStr}</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{cheapestPriceStr}</span>
          </div>
        </div>

        {/* Card 3: Precio medio del día */}
        <div className="bg-white dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="pi pi-chart-bar text-amber-600 dark:text-amber-400"></span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Precio medio del día</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{averagePriceStr}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-semibold uppercase tracking-wider">Media aritmética</span>
          </div>
        </div>

        {/* Card 4: Mejor Franja (1 hora) */}
        <div className="bg-white dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="pi pi-check-circle text-sky-600 dark:text-sky-400"></span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Mejor Franja (1h)</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{bestIntervalStr}</span>
            <span className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-1">{bestIntervalPriceStr}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSummary;
