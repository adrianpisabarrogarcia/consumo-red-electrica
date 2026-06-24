import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import PriceSummary from "./components/PriceSummary";
import ApplianceRecommendations from "./components/ApplianceRecommendations";
import PriceTable from "./components/PriceTable";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";
import { fetchHourlyPrices } from "./services/reeApi";
import {
  calculateAveragePrice,
  findCheapestHour,
  findCurrentPrice,
  findBestInterval,
  type HourlyPrice,
  type PriceStats,
} from "./utils/priceCalculations";
import { Skeleton } from "primereact/skeleton";

// Import PrimeReact themes dynamically using Vite's inline css suffix
import darkTheme from "primereact/resources/themes/lara-dark-blue/theme.css?inline";
import lightTheme from "primereact/resources/themes/lara-light-blue/theme.css?inline";

function App() {
  const [prices, setPrices] = useState<HourlyPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PriceStats | null>(null);

  // Theme state: initialized from localStorage, defaulting to 'dark'
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Synchronize theme styles and classes in a side-effect
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // 1. Toggle dark class and set body colors
    if (theme === "dark") {
      root.classList.add("dark");
      body.style.backgroundColor = "#0b0f19";
      body.style.color = "#f3f4f6";
    } else {
      root.classList.remove("dark");
      body.style.backgroundColor = "#f8fafc";
      body.style.color = "#0f172a";
    }

    // 2. Swapping PrimeReact stylesheet strings
    let styleTag = document.getElementById("primereact-theme") as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "primereact-theme";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = theme === "dark" ? darkTheme : lightTheme;

    // 3. Persist theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHourlyPrices();
      
      const average = calculateAveragePrice(data);
      const cheapest = findCheapestHour(data);
      const currentHour = new Date().getHours();
      const currentPrice = findCurrentPrice(data, currentHour);
      const bestInterval = findBestInterval(data);

      const calculatedStats: PriceStats = {
        averagePrice: average,
        cheapestHour: cheapest,
        currentPrice: currentPrice,
        bestInterval: bestInterval,
      };

      setPrices(data);
      setStats(calculatedStats);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error desconocido al obtener datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6 animate-pulse">
          {/* Skeleton Banner */}
          <div className="p-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Skeleton width="80%" height="1.2rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/30 rounded-xl p-6 space-y-4 shadow-sm dark:shadow-xl backdrop-blur-md">
                <Skeleton width="50%" height="1.2rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
                <Skeleton width="80%" height="2rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
              </div>
            ))}
          </div>

          {/* Skeleton Table */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/30 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-xl backdrop-blur-md">
            <div className="space-y-2 w-1/3">
              <Skeleton width="60%" height="1.5rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
              <Skeleton width="90%" height="1rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
            </div>
            <div className="space-y-3 mt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-900">
                  <Skeleton width="25%" height="1.2rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
                  <Skeleton width="20%" height="1.2rem" borderRadius="6px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
                  <Skeleton width="15%" height="1.5rem" borderRadius="9999px" className="bg-slate-200 dark:bg-slate-800"></Skeleton>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 border border-rose-500/20 bg-rose-500/5 rounded-2xl max-w-2xl mx-auto text-center space-y-4 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <span className="pi pi-exclamation-triangle text-rose-500 dark:text-rose-400 text-xl"></span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Error al cargar los precios</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer animate-pulse"
          >
            <span className="pi pi-refresh text-xs"></span>
            Reintentar
          </button>
        </div>
      );
    }

    if (stats) {
      return (
        <>
          <PriceSummary stats={stats} />
          <ApplianceRecommendations prices={prices} averagePrice={stats.averagePrice} />
          <PriceTable prices={prices} averagePrice={stats.averagePrice} />
        </>
      );
    }

    return null;
  };

  return (
    <>
      <AnimatedBackground theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {renderContent()}
      </main>
      <Footer />
    </>
  );
}

export default App;
