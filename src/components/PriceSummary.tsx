import React from "react";
import { Panel } from "primereact/panel";
import { type PriceStats } from "../utils/priceCalculations";

interface PriceSummaryProps {
  stats: PriceStats;
}

const formatHourSlot = (hour: number) => {
  const start = String(hour).padStart(2, "0");
  const end = String((hour + 1) % 24).padStart(2, "0");
  return `${start}:00 - ${end}:00`;
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

  return (
    <section className="space-y-6">
      {/* Informational Banner */}
      <div className="flex items-center justify-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl text-slate-300 text-sm gap-2">
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
          className="text-indigo-400 shrink-0"
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
        <Panel
          header={
            <div className="flex items-center gap-2">
              <span className="pi pi-clock text-indigo-400"></span>
              <span className="font-semibold text-slate-200">Precio ahora</span>
            </div>
          }
          className="shadow-md hover:shadow-lg transition-all duration-300 border border-slate-800 bg-slate-950/50 rounded-xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">{priceNowStr}</span>
            <span className="text-xs text-indigo-400 mt-2 font-medium uppercase tracking-wider">Hora actual</span>
          </div>
        </Panel>

        {/* Card 2: Hora más barata */}
        <Panel
          header={
            <div className="flex items-center gap-2">
              <span className="pi pi-arrow-down-circle text-emerald-400"></span>
              <span className="font-semibold text-slate-200">Hora más barata</span>
            </div>
          }
          className="shadow-md hover:shadow-lg transition-all duration-300 border border-slate-800 bg-slate-950/50 rounded-xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-2xl font-bold text-slate-100 tracking-tight">{cheapestHourStr}</span>
            <span className="text-lg font-semibold text-emerald-400 mt-1">{cheapestPriceStr}</span>
          </div>
        </Panel>

        {/* Card 3: Precio medio del día */}
        <Panel
          header={
            <div className="flex items-center gap-2">
              <span className="pi pi-chart-bar text-amber-400"></span>
              <span className="font-semibold text-slate-200">Precio medio del día</span>
            </div>
          }
          className="shadow-md hover:shadow-lg transition-all duration-300 border border-slate-800 bg-slate-950/50 rounded-xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">{averagePriceStr}</span>
            <span className="text-xs text-amber-400 mt-2 font-medium uppercase tracking-wider">Media aritmética</span>
          </div>
        </Panel>

        {/* Card 4: Mejor Franja (1 hora) */}
        <Panel
          header={
            <div className="flex items-center gap-2">
              <span className="pi pi-check-circle text-sky-400"></span>
              <span className="font-semibold text-slate-200">Mejor Franja (1h)</span>
            </div>
          }
          className="shadow-md hover:shadow-lg transition-all duration-300 border border-slate-800 bg-slate-950/50 rounded-xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-2xl font-bold text-slate-100 tracking-tight">{bestIntervalStr}</span>
            <span className="text-lg font-semibold text-sky-400 mt-1">{bestIntervalPriceStr}</span>
          </div>
        </Panel>
      </div>
    </section>
  );
};

export default PriceSummary;
