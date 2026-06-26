import "./App.css";
import Header from "./core/layout/Header";
import Footer from "./core/layout/Footer";
import AnimatedBackground from "./features/theme/components/AnimatedBackground";
import { useTheme } from "./features/theme/hooks/useTheme";
import { usePvpcData } from "./features/prices/hooks/usePvpcData";
import PriceSummary from "./features/prices/components/PriceSummary";
import ApplianceRecommendations from "./features/appliances/components/ApplianceRecommendations";
import PriceTable from "./features/prices/components/PriceTable";
import { Skeleton } from "primereact/skeleton";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { prices, stats, loading, error, refetch } = usePvpcData();

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
            onClick={refetch}
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
      {/* Background color layer that stays behind the animated particles */}
      <div className="fixed inset-0 -z-20 bg-[#f8fafc] dark:bg-[#0b0f19] transition-colors duration-500" />
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
