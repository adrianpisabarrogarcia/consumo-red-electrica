import React, { useMemo } from "react";
import {
  findBestWindowForAppliance,
  categorizeHours,
  type HourlyPrice
} from "../utils/applianceRecommendations";

interface ApplianceRecommendationsProps {
  prices: HourlyPrice[];
  averagePrice: number;
}

const formatHourSlot = (start: number, end: number) => {
  const startStr = String(start).padStart(2, "0");
  const endStr = String(end).padStart(2, "0");
  return `${startStr}:00 - ${endStr}:00`;
};

// Helper function to group consecutive hours into ranges (e.g. 14, 15, 16 -> "14:00 - 17:00")
const getConsecutiveRanges = (hours: number[]): string[] => {
  if (!hours || hours.length === 0) return [];
  const sorted = [...hours].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      ranges.push(formatHourSlot(start, prev + 1));
      start = sorted[i];
      prev = sorted[i];
    }
  }
  ranges.push(formatHourSlot(start, prev + 1));
  return ranges;
};

export const ApplianceRecommendations: React.FC<ApplianceRecommendationsProps> = ({
  prices,
  averagePrice,
}) => {
  // Find the peak price of the day to calculate savings relative to the worst time
  const peakPrice = useMemo(() => {
    if (!prices || prices.length === 0) return 0;
    return Math.max(...prices.map((p) => p.price));
  }, [prices]);

  // Categorize all hours of the day
  const categorizedHours = useMemo(() => {
    return categorizeHours(prices, averagePrice);
  }, [prices, averagePrice]);

  // Filter cheap and expensive hours
  const cheapHours = useMemo(() => {
    return categorizedHours.filter((h) => h.category === "cheap").map((h) => h.hour);
  }, [categorizedHours]);

  const expensiveHours = useMemo(() => {
    return categorizedHours.filter((h) => h.category === "expensive").map((h) => h.hour);
  }, [categorizedHours]);

  // Format consecutive cheap and expensive ranges
  const cheapRanges = useMemo(() => getConsecutiveRanges(cheapHours), [cheapHours]);
  const expensiveRanges = useMemo(() => getConsecutiveRanges(expensiveHours), [expensiveHours]);

  // Appliances configuration
  const appliances = [
    {
      name: "Lavadora",
      duration: 2,
      icon: "pi pi-cog",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
      description: "Ciclo estándar de lavado caliente",
    },
    {
      name: "Lavavajillas",
      duration: 2,
      icon: "pi pi-sync",
      iconBg: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20",
      description: "Ciclo eco de lavado diario",
    },
    {
      name: "Horno",
      duration: 1,
      icon: "pi pi-database",
      iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
      description: "Cocinado o asado a temperatura media",
    },
    {
      name: "Termo Eléctrico",
      duration: 3,
      icon: "pi pi-sliders-h",
      iconBg: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20",
      description: "Calentamiento y acumulación de agua",
    },
    {
      name: "Aire Acondicionado",
      duration: 4,
      icon: "pi pi-sun",
      iconBg: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20",
      description: "Climatización continua de confort",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="pi pi-bolt text-xl text-indigo-600 dark:text-indigo-400"></span>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Optimización por Electrodomésticos
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Recomendaciones de uso inteligente basadas en el precio de la luz de hoy
          </p>
        </div>
      </div>

      {/* Section 1: Appliance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {appliances.map((appliance) => {
          const bestWindow = findBestWindowForAppliance(prices, appliance.duration);
          
          if (!bestWindow) {
            return (
              <div
                key={appliance.name}
                className="bg-white/75 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-5 text-center text-slate-700 dark:text-slate-300 text-sm"
              >
                No hay datos para {appliance.name}
              </div>
            );
          }

          // Calculate savings percentage vs worst (peak) price hour of the day
          const savingsPercent =
            peakPrice > 0
              ? Math.round((1 - bestWindow.averagePrice / peakPrice) * 100)
              : 0;

          return (
            <div
              key={appliance.name}
              className="bg-white/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 rounded-xl p-5 hover:border-slate-400/80 dark:hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm dark:shadow-none"
            >
              <div className="space-y-3">
                {/* Icon and Name */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${appliance.iconBg}`}>
                    <span className={`${appliance.icon} text-lg`}></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm sm:text-base">
                      {appliance.name}
                    </h3>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Duración: {appliance.duration}h
                    </span>
                  </div>
                </div>

                {/* Slot and Average Price */}
                <div className="space-y-1 pl-1">
                  <div className="text-slate-900 dark:text-slate-300 font-extrabold text-base tracking-tight">
                    {formatHourSlot(bestWindow.startHour, bestWindow.endHour)}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <span>Precio medio:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {bestWindow.averagePrice.toFixed(4)} €/kWh
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings Badge */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/40 flex items-center justify-between">
                <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold whitespace-nowrap">
                  Ahorro vs pico
                </span>
                {savingsPercent > 0 ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 whitespace-nowrap">
                    -{savingsPercent}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">0%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Semáforo Energético */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Cheap Hours column */}
        <div className="bg-white/75 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Horas más recomendadas (Baratas)
            </h3>
          </div>
          {cheapRanges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cheapRanges.map((range) => (
                <span
                  key={range}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors duration-200"
                >
                  <span className="pi pi-calendar-times text-[10px]"></span>
                  {range}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-700 dark:text-slate-300 italic">No hay horas especialmente baratas hoy.</p>
          )}
        </div>

        {/* Expensive Hours column */}
        <div className="bg-white/75 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Horas a evitar (Caras)
            </h3>
          </div>
          {expensiveRanges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {expensiveRanges.map((range) => (
                <span
                  key={range}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-500/5 text-rose-800 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-colors duration-200"
                >
                  <span className="pi pi-exclamation-triangle text-[10px]"></span>
                  {range}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-700 dark:text-slate-300 italic">No hay horas especialmente caras hoy.</p>
          )}
        </div>
      </div>

      {/* Section 3: Practical Tip Banner */}
      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 9h.01" />
          <path d="M11 12h1v4h1" />
        </svg>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-100 leading-relaxed">
          <strong>Consejo:</strong> Programá tus electrodomésticos de alto consumo en las horas baratas. Si usás la lavadora a las 15:00 en lugar de las 21:00, podés ahorrar un gran porcentaje en tu factura.
        </p>
      </div>
    </section>
  );
};

export default ApplianceRecommendations;
