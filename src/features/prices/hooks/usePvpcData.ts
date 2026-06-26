import { useState, useEffect, useCallback } from "react";
import { fetchHourlyPrices } from "../services/reeApi";
import {
  calculateAveragePrice,
  findCheapestHour,
  findCurrentPrice,
  findBestInterval,
  type HourlyPrice,
  type PriceStats,
} from "../utils/priceCalculations";

export function usePvpcData() {
  const [prices, setPrices] = useState<HourlyPrice[]>([]);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    prices,
    stats,
    loading,
    error,
    refetch: loadData,
  };
}
