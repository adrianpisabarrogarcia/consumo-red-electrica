import { type HourlyPrice } from '../../prices/utils/priceCalculations';
export type { HourlyPrice };

export interface BestWindow {
  startHour: number;
  endHour: number;
  averagePrice: number;
}

export interface CategorizedHour {
  hour: number;
  price: number;
  category: 'cheap' | 'normal' | 'expensive';
}

/**
 * Finds the consecutive window of durationHours (within the 00:00 to 24:00 daily range)
 * that has the lowest average price.
 * Returns null if the array is empty, the duration is invalid, or exceeds the array length.
 * In case of ties, returns the first window found.
 */
export function findBestWindowForAppliance(
  prices: HourlyPrice[],
  durationHours: number
): BestWindow | null {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null;
  }
  if (durationHours <= 0 || durationHours > prices.length || !Number.isInteger(durationHours)) {
    return null;
  }

  let minAverage = Infinity;
  let bestWindow: BestWindow | null = null;

  for (let i = 0; i <= prices.length - durationHours; i++) {
    let sum = 0;
    for (let j = 0; j < durationHours; j++) {
      sum += prices[i + j].price;
    }
    const average = sum / durationHours;

    // Use strict less than to return the first window in case of a tie
    if (average < minAverage) {
      minAverage = average;
      const startHour = prices[i].hour;
      const endHour = prices[i + durationHours - 1].hour + 1;
      bestWindow = {
        startHour,
        endHour,
        averagePrice: average,
      };
    }
  }

  return bestWindow;
}

/**
 * Categorizes each of the 24 hours of the day.
 * An hour is 'cheap' if its price is below 90% of the daily average.
 * It is 'expensive' if its price is above 110% of the daily average.
 * Otherwise, it is 'normal'.
 * Returns an empty array if inputs are invalid or averagePrice is non-positive.
 */
export function categorizeHours(
  prices: HourlyPrice[],
  averagePrice: number
): CategorizedHour[] {
  if (!prices || !Array.isArray(prices) || prices.length === 0 || averagePrice <= 0) {
    return [];
  }

  const cheapThreshold = averagePrice * 0.9;
  const expensiveThreshold = averagePrice * 1.1;

  return prices.map((p) => {
    let category: 'cheap' | 'normal' | 'expensive' = 'normal';
    if (p.price < cheapThreshold) {
      category = 'cheap';
    } else if (p.price > expensiveThreshold) {
      category = 'expensive';
    }
    return {
      hour: p.hour,
      price: p.price,
      category,
    };
  });
}
