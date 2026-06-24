import { describe, it, expect } from 'vitest';
import {
  findBestWindowForAppliance,
  categorizeHours,
  type HourlyPrice
} from './applianceRecommendations';

// Mock 24-hour price data
const mock24hPrices: HourlyPrice[] = [
  { hour: 0, price: 0.15, datetime: '2026-06-24T00:00:00Z' },
  { hour: 1, price: 0.14, datetime: '2026-06-24T01:00:00Z' },
  { hour: 2, price: 0.13, datetime: '2026-06-24T02:00:00Z' },
  { hour: 3, price: 0.12, datetime: '2026-06-24T03:00:00Z' },
  { hour: 4, price: 0.11, datetime: '2026-06-24T04:00:00Z' },
  { hour: 5, price: 0.10, datetime: '2026-06-24T05:00:00Z' },
  { hour: 6, price: 0.12, datetime: '2026-06-24T06:00:00Z' },
  { hour: 7, price: 0.14, datetime: '2026-06-24T07:00:00Z' },
  { hour: 8, price: 0.18, datetime: '2026-06-24T08:00:00Z' },
  { hour: 9, price: 0.22, datetime: '2026-06-24T09:00:00Z' },
  { hour: 10, price: 0.25, datetime: '2026-06-24T10:00:00Z' },
  { hour: 11, price: 0.24, datetime: '2026-06-24T11:00:00Z' },
  { hour: 12, price: 0.23, datetime: '2026-06-24T12:00:00Z' },
  { hour: 13, price: 0.20, datetime: '2026-06-24T13:00:00Z' },
  { hour: 14, price: 0.18, datetime: '2026-06-24T14:00:00Z' },
  { hour: 15, price: 0.08, datetime: '2026-06-24T15:00:00Z' }, // Cheapest hour (15:00 - 16:00)
  { hour: 16, price: 0.09, datetime: '2026-06-24T16:00:00Z' },
  { hour: 17, price: 0.12, datetime: '2026-06-24T17:00:00Z' },
  { hour: 18, price: 0.17, datetime: '2026-06-24T18:00:00Z' },
  { hour: 19, price: 0.22, datetime: '2026-06-24T19:00:00Z' },
  { hour: 20, price: 0.26, datetime: '2026-06-24T20:00:00Z' }, // Most expensive hour
  { hour: 21, price: 0.24, datetime: '2026-06-24T21:00:00Z' },
  { hour: 22, price: 0.20, datetime: '2026-06-24T22:00:00Z' },
  { hour: 23, price: 0.17, datetime: '2026-06-24T23:00:00Z' },
];

describe('Appliance Recommendations Utils', () => {
  describe('findBestWindowForAppliance', () => {
    it('should find the correct cheapest 2-hour window', () => {
      // 15:00 and 16:00 are 0.08 and 0.09. Average is 0.085
      const result = findBestWindowForAppliance(mock24hPrices, 2);
      expect(result).not.toBeNull();
      expect(result!.startHour).toBe(15);
      expect(result!.endHour).toBe(17);
      expect(result!.averagePrice).toBeCloseTo(0.085, 4);
    });

    it('should find the correct cheapest 3-hour window', () => {
      // 15:00, 16:00, 17:00 are 0.08, 0.09, 0.12. Average is (0.08+0.09+0.12)/3 = 0.0967
      const result = findBestWindowForAppliance(mock24hPrices, 3);
      expect(result).not.toBeNull();
      expect(result!.startHour).toBe(15);
      expect(result!.endHour).toBe(18);
      expect(result!.averagePrice).toBeCloseTo(0.0967, 4);
    });

    it('should find the correct cheapest 1-hour window (matches cheapest hour)', () => {
      const result = findBestWindowForAppliance(mock24hPrices, 1);
      expect(result).not.toBeNull();
      expect(result!.startHour).toBe(15);
      expect(result!.endHour).toBe(16);
      expect(result!.averagePrice).toBe(0.08);
    });

    it('should return the first cheapest window if there is a tie', () => {
      const tiePrices: HourlyPrice[] = [
        { hour: 0, price: 0.10, datetime: '' },
        { hour: 1, price: 0.05, datetime: '' },
        { hour: 2, price: 0.05, datetime: '' },
        { hour: 3, price: 0.10, datetime: '' },
        { hour: 4, price: 0.05, datetime: '' },
        { hour: 5, price: 0.05, datetime: '' },
      ];
      // Windows of 2 hours:
      // [0, 1] => 0.075
      // [1, 2] => 0.05  (First min)
      // [2, 3] => 0.075
      // [3, 4] => 0.075
      // [4, 5] => 0.05  (Second min)
      const result = findBestWindowForAppliance(tiePrices, 2);
      expect(result).not.toBeNull();
      expect(result!.startHour).toBe(1);
      expect(result!.endHour).toBe(3);
      expect(result!.averagePrice).toBe(0.05);
    });

    it('should return the entire day average if duration is exactly 24', () => {
      const result = findBestWindowForAppliance(mock24hPrices, 24);
      expect(result).not.toBeNull();
      expect(result!.startHour).toBe(0);
      expect(result!.endHour).toBe(24);
      // Total sum = 4.06. 4.06 / 24 = 0.1691666...
      expect(result!.averagePrice).toBeCloseTo(0.1692, 4);
    });

    it('should return null if duration is greater than array size', () => {
      const result = findBestWindowForAppliance(mock24hPrices, 25);
      expect(result).toBeNull();
    });

    it('should return null if duration is zero or negative', () => {
      expect(findBestWindowForAppliance(mock24hPrices, 0)).toBeNull();
      expect(findBestWindowForAppliance(mock24hPrices, -3)).toBeNull();
    });

    it('should return null if duration is not an integer', () => {
      expect(findBestWindowForAppliance(mock24hPrices, 1.5)).toBeNull();
    });

    it('should return null if price array is empty', () => {
      expect(findBestWindowForAppliance([], 2)).toBeNull();
    });

    it('should return null if price array is null or undefined', () => {
      // @ts-expect-error testing runtime safety
      expect(findBestWindowForAppliance(null, 2)).toBeNull();
      // @ts-expect-error testing runtime safety
      expect(findBestWindowForAppliance(undefined, 2)).toBeNull();
    });
  });

  describe('categorizeHours', () => {
    const dailyAvg = 0.169167;

    it('should categorize hours correctly into cheap, normal, and expensive', () => {
      // Cheap threshold (< 90% of avg) = < 0.15225
      // Expensive threshold (> 110% of avg) = > 0.18608
      const categorized = categorizeHours(mock24hPrices, dailyAvg);
      expect(categorized.length).toBe(24);

      // Check cheap hour: hour 15 (0.08)
      const hr15 = categorized.find(h => h.hour === 15);
      expect(hr15).toBeDefined();
      expect(hr15!.category).toBe('cheap');

      // Check expensive hour: hour 20 (0.26)
      const hr20 = categorized.find(h => h.hour === 20);
      expect(hr20).toBeDefined();
      expect(hr20!.category).toBe('expensive');

      // Check normal hour: hour 18 (0.17)
      const hr18 = categorized.find(h => h.hour === 18);
      expect(hr18).toBeDefined();
      expect(hr18!.category).toBe('normal');

      // Hour 0 (0.15) should be cheap (< 0.15225)
      const hr0 = categorized.find(h => h.hour === 0);
      expect(hr0!.category).toBe('cheap');
    });

    it('should return empty array if price array is empty', () => {
      expect(categorizeHours([], dailyAvg)).toEqual([]);
    });

    it('should return empty array if price array is null or undefined', () => {
      // @ts-expect-error testing runtime safety
      expect(categorizeHours(null, dailyAvg)).toEqual([]);
      // @ts-expect-error testing runtime safety
      expect(categorizeHours(undefined, dailyAvg)).toEqual([]);
    });

    it('should return empty array if averagePrice is zero or negative', () => {
      expect(categorizeHours(mock24hPrices, 0)).toEqual([]);
      expect(categorizeHours(mock24hPrices, -0.15)).toEqual([]);
    });
  });
});
