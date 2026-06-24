import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchHourlyPrices, type ReeApiResponse } from './reeApi';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

// Mock fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('reeApi Service', () => {
  const mockApiResponse: ReeApiResponse = {
    included: [
      {
        type: 'Precio voluntario para el pequeño consumidor',
        id: '1013',
        attributes: {
          title: 'Precio voluntario para el pequeño consumidor',
          values: [
            { value: 150.5, datetime: '2026-06-24T00:00:00.000+02:00' },
            { value: 140.2, datetime: '2026-06-24T01:00:00.000+02:00' },
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('fetchHourlyPrices', () => {
    it('should return cached data and not call fetch on cache hit', async () => {
      const cachedData = [
        { hour: 0, price: 0.1505, datetime: '2026-06-24T00:00:00.000+02:00' },
        { hour: 1, price: 0.1402, datetime: '2026-06-24T01:00:00.000+02:00' },
      ];
      localStorageMock.setItem('pvpc-2026-06-24', JSON.stringify(cachedData));
      vi.clearAllMocks(); // Clear to reset call counts

      const result = await fetchHourlyPrices('2026-06-24');

      expect(result).toEqual(cachedData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pvpc-2026-06-24');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should call fetch, parse data, write to localStorage, and return parsed data on cache miss', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockApiResponse,
      });

      const result = await fetchHourlyPrices('2026-06-24');

      const expectedData = [
        { hour: 0, price: 0.1505, datetime: '2026-06-24T00:00:00.000+02:00' },
        { hour: 1, price: 0.1402, datetime: '2026-06-24T01:00:00.000+02:00' },
      ];

      expect(result).toEqual(expectedData);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=2026-06-24T00:00&end_date=2026-06-24T23:59&time_trunc=hour'
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pvpc-2026-06-24',
        JSON.stringify(expectedData)
      );
    });

    it('should throw an error on API failure and not write to cache', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchHourlyPrices('2026-06-24')).rejects.toThrow(
        'Failed to fetch PVPC prices: 500 Internal Server Error'
      );

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should throw an error on network failure and not write to cache', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network connection failed'));

      await expect(fetchHourlyPrices('2026-06-24')).rejects.toThrow(
        'Network connection failed'
      );

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should throw an error if the API response is invalid or missing series', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await expect(fetchHourlyPrices('2026-06-24')).rejects.toThrow(
        'Invalid response structure from REE API'
      );

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should fall back to the first series if the exact PVPC ID or title is not matched', async () => {
      const alternativeResponse: ReeApiResponse = {
        included: [
          {
            type: 'Other series',
            id: '9999',
            attributes: {
              title: 'Alternative series title',
              values: [
                { value: 200, datetime: '2026-06-24T00:00:00.000+02:00' },
              ],
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => alternativeResponse,
      });

      const result = await fetchHourlyPrices('2026-06-24');
      expect(result).toEqual([
        { hour: 0, price: 0.2, datetime: '2026-06-24T00:00:00.000+02:00' },
      ]);
    });
  });
});
