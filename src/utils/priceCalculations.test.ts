import { describe, it, expect } from 'vitest';
import {
  calculateAveragePrice,
  findCheapestHour,
  findCurrentPrice,
  findBestInterval,
  type HourlyPrice
} from './priceCalculations';

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

describe('Price Calculations', () => {
  describe('calculateAveragePrice', () => {
    it('should calculate the correct average price for a valid 24-hour array', () => {
      // Sum of prices = 4.06
      // 4.06 / 24 = 0.169166666...
      const avg = calculateAveragePrice(mock24hPrices);
      expect(avg).toBeCloseTo(0.169167, 6);
    });

    it('should return 0 for an empty array', () => {
      expect(calculateAveragePrice([])).toBe(0);
    });

    it('should return 0 if the array is null or undefined (as a safe fallback)', () => {
      // @ts-expect-error testing runtime safety
      expect(calculateAveragePrice(null)).toBe(0);
      // @ts-expect-error testing runtime safety
      expect(calculateAveragePrice(undefined)).toBe(0);
    });

    it('should calculate the average correctly even if some hours are missing', () => {
      const incompletePrices = [
        { hour: 0, price: 0.10, datetime: '2026-06-24T00:00:00Z' },
        { hour: 1, price: 0.20, datetime: '2026-06-24T01:00:00Z' },
      ];
      expect(calculateAveragePrice(incompletePrices)).toBeCloseTo(0.15, 6);
    });
  });

  describe('findCheapestHour', () => {
    it('should identify the cheapest hour and price correctly', () => {
      const cheapest = findCheapestHour(mock24hPrices);
      expect(cheapest).toEqual({ hour: 15, price: 0.08 });
    });

    it('should return null for an empty array', () => {
      expect(findCheapestHour([])).toBeNull();
    });

    it('should return null if the array is null or undefined', () => {
      // @ts-expect-error testing runtime safety
      expect(findCheapestHour(null)).toBeNull();
      // @ts-expect-error testing runtime safety
      expect(findCheapestHour(undefined)).toBeNull();
    });

    it('should return the first cheapest hour if there are duplicates', () => {
      const duplicateCheapest = [
        { hour: 0, price: 0.10, datetime: '2026-06-24T00:00:00Z' },
        { hour: 1, price: 0.05, datetime: '2026-06-24T01:00:00Z' },
        { hour: 2, price: 0.05, datetime: '2026-06-24T02:00:00Z' },
        { hour: 3, price: 0.15, datetime: '2026-06-24T03:00:00Z' },
      ];
      const cheapest = findCheapestHour(duplicateCheapest);
      expect(cheapest).toEqual({ hour: 1, price: 0.05 });
    });
  });

  describe('findCurrentPrice', () => {
    it('should return the price for a specific hour', () => {
      expect(findCurrentPrice(mock24hPrices, 0)).toBe(0.15);
      expect(findCurrentPrice(mock24hPrices, 12)).toBe(0.23);
      expect(findCurrentPrice(mock24hPrices, 23)).toBe(0.17);
    });

    it('should return null if the hour is not found in the array', () => {
      const incompletePrices = [
        { hour: 0, price: 0.10, datetime: '2026-06-24T00:00:00Z' },
      ];
      expect(findCurrentPrice(incompletePrices, 5)).toBeNull();
    });

    it('should return null if the target hour is invalid (out of 0-23 bounds)', () => {
      expect(findCurrentPrice(mock24hPrices, -1)).toBeNull();
      expect(findCurrentPrice(mock24hPrices, 24)).toBeNull();
    });

    it('should return null for an empty array', () => {
      expect(findCurrentPrice([], 12)).toBeNull();
    });

    it('should return null if the array is null or undefined', () => {
      // @ts-expect-error testing runtime safety
      expect(findCurrentPrice(null, 12)).toBeNull();
      // @ts-expect-error testing runtime safety
      expect(findCurrentPrice(undefined, 12)).toBeNull();
    });
  });

  describe('findBestInterval', () => {
    it('should return the best 1-hour interval (which corresponds to the cheapest hour)', () => {
      const best = findBestInterval(mock24hPrices);
      expect(best).toEqual({
        startHour: 15,
        endHour: 16,
        averagePrice: 0.08
      });
    });

    it('should return null for an empty array', () => {
      expect(findBestInterval([])).toBeNull();
    });

    it('should return null if the array is null or undefined', () => {
      // @ts-expect-error testing runtime safety
      expect(findBestInterval(null)).toBeNull();
      // @ts-expect-error testing runtime safety
      expect(findBestInterval(undefined)).toBeNull();
    });

    it('should handle duplicate cheapest hours by returning the first one', () => {
      const duplicateCheapest = [
        { hour: 0, price: 0.10, datetime: '2026-06-24T00:00:00Z' },
        { hour: 1, price: 0.05, datetime: '2026-06-24T01:00:00Z' },
        { hour: 2, price: 0.05, datetime: '2026-06-24T02:00:00Z' },
        { hour: 3, price: 0.15, datetime: '2026-06-24T03:00:00Z' },
      ];
      const best = findBestInterval(duplicateCheapest);
      expect(best).toEqual({
        startHour: 1,
        endHour: 2,
        averagePrice: 0.05
      });
    });
  });
});
