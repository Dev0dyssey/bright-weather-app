const { getCoordinates } = require('./weatherService');

global.fetch = jest.fn();

describe('weatherService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getCoordinates', () => {
    it('should return lat/lon for a valid city', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: 51.5074, lon: -0.1278 }]
      });

      const result = await getCoordinates('London', 'GB');

      expect(result).toEqual({ lat: 51.5074, lon: -0.1278 });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=London,GB')
      );
    });

    it('should throw error when city not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      await expect(getCoordinates('FakeCity', 'GB'))
        .rejects
        .toThrow('No coordinates found for FakeCity in GB');
    });

    it('should throw error when API fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(getCoordinates('London', 'GB'))
        .rejects
        .toThrow('Weather service unavailable');
    });

    it('should default to GB when no country provided', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: 51.5074, lon: -0.1278 }]
      });

      await getCoordinates('London');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=London,GB')
      );
    });
  });
});