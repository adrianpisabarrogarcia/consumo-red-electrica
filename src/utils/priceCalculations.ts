export interface HourlyPrice {
  hour: number;        // 0 to 23
  price: number;       // Price in €/kWh (e.g., 0.1332)
  datetime: string;    // Original ISO string
}

export interface PriceStats {
  averagePrice: number;
  cheapestHour: { hour: number; price: number } | null;
  currentPrice: number | null;
  bestInterval: { startHour: number; endHour: number; averagePrice: number } | null;
}


/**
 * Calculates the arithmetic mean of all hourly prices of the day.
 * Returns 0 if the array is empty, null, or undefined.
 */
export function calculateAveragePrice(prices: HourlyPrice[]): number {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return 0;
  }
  const sum = prices.reduce((acc, curr) => acc + curr.price, 0);
  return sum / prices.length;
}

/**
 * Identifies the hour (0-23) with the lowest price of the day.
 * Returns null if the array is empty, null, or undefined.
 * In case of duplicates, returns the first one found.
 */
export function findCheapestHour(prices: HourlyPrice[]): { hour: number; price: number } | null {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null;
  }

  let cheapest = prices[0];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i].price < cheapest.price) {
      cheapest = prices[i];
    }
  }

  return {
    hour: cheapest.hour,
    price: cheapest.price,
  };
}

/**
 * Determines the price corresponding to a specific hour (usually the current hour).
 * Returns null if the hour is not found, out of bounds (not 0-23), or the array is invalid.
 */
export function findCurrentPrice(prices: HourlyPrice[], currentHour: number): number | null {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null;
  }
  if (currentHour < 0 || currentHour > 23) {
    return null;
  }

  const record = prices.find((p) => p.hour === currentHour);
  return record ? record.price : null;
}

/**
 * Finds the 1-hour interval with the lowest average price.
 * Since this is a 1-hour interval, it corresponds to the cheapest hour,
 * returning the block starting at hour X and ending at X+1.
 * Returns null if the array is empty, null, or undefined.
 */
export function findBestInterval(prices: HourlyPrice[]): { startHour: number; endHour: number; averagePrice: number } | null {
  const cheapest = findCheapestHour(prices);
  if (!cheapest) {
    return null;
  }

  return {
    startHour: cheapest.hour,
    endHour: cheapest.hour + 1,
    averagePrice: cheapest.price,
  };
}
