import { type HourlyPrice } from '../utils/priceCalculations';

/**
 * Formats a Date object to YYYY-MM-DD using the local timezone.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Extracts the Spanish hour (0-23) from the API's ISO datetime string in a timezone-independent way.
 * Falls back to native Date parsing if the string structure is unexpected.
 */
function extractHour(datetimeStr: string): number {
  try {
    const timePart = datetimeStr.split('T')[1];
    if (timePart) {
      const hourPart = timePart.split(':')[0];
      if (hourPart) {
        const hour = parseInt(hourPart, 10);
        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
          return hour;
        }
      }
    }
  } catch {
    // Ignore and fallback to Date parse
  }
  return new Date(datetimeStr).getHours();
}

export interface ReeApiValue {
  value: number;
  datetime: string;
}

export interface ReeApiSeries {
  type: string;
  id: string;
  attributes: {
    title: string;
    values: ReeApiValue[];
  };
}

export interface ReeApiResponse {
  included: ReeApiSeries[];
}

/**
 * Fetches PVPC hourly prices for a given date from the REE API.
 * Uses localStorage to cache results by date.
 *
 * @param dateInput Optional date as Date object or YYYY-MM-DD string. Defaults to current date.
 * @returns Sorted array of 24 HourlyPrice items.
 */
export async function fetchHourlyPrices(dateInput?: Date | string): Promise<HourlyPrice[]> {
  let dateStr: string;
  if (!dateInput) {
    dateStr = formatDate(new Date());
  } else if (typeof dateInput === 'string') {
    dateStr = dateInput;
  } else {
    dateStr = formatDate(dateInput);
  }

  const cacheKey = `pvpc-${dateStr}`;
  
  // 1. Check daily cache in localStorage
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as HourlyPrice[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Cache is corrupt, proceed to fetch fresh data
      }
    }
  }

  // 2. Fetch from REE API
  const url = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${dateStr}T00:00&end_date=${dateStr}T23:59&time_trunc=hour`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PVPC prices: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ReeApiResponse;
    if (!data || !data.included || data.included.length === 0) {
      throw new Error('Invalid response structure from REE API: missing included series');
    }

    // Find the series representing PVPC prices
    const pvpcSeries = data.included.find(
      (series) =>
        series.id === '1013' ||
        series.attributes?.title?.toLowerCase().includes('pvpc') ||
        series.attributes?.title?.toLowerCase().includes('precio voluntario')
    ) || data.included[0];

    if (!pvpcSeries || !pvpcSeries.attributes || !pvpcSeries.attributes.values) {
      throw new Error('PVPC price series not found in REE API response');
    }

    const values = pvpcSeries.attributes.values;
    if (values.length === 0) {
      throw new Error('REE API returned empty PVPC price values');
    }

    // Map, convert €/MWh to €/kWh, and sort by hour
    const hourlyPrices: HourlyPrice[] = values.map((val) => {
      const hour = extractHour(val.datetime);
      const price = val.value / 1000;
      return {
        hour,
        price,
        datetime: val.datetime,
      };
    });

    hourlyPrices.sort((a, b) => a.hour - b.hour);

    // Save to cache
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify(hourlyPrices));
    }

    return hourlyPrices;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching PVPC prices');
  }
}
