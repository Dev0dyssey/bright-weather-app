process.env.OPENWEATHER_API_KEY = 'test-api-key';

const { NotFoundError, ServiceUnavailableError, ValidationError } = require('../../utils/errors');
const { getCityWeather } = require('./weatherService');

global.fetch = jest.fn();

describe('weatherService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('getCityWeather', () => {
        it('should return transformed weather data for valid city', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    main: {
                        temp: 15.5,
                        feels_like: 14.2,
                        humidity: 72,
                        temp_min: 13.0,
                        temp_max: 17.0
                    },
                    wind: { speed: 4.0 },
                    rain: { '1h': 0.5 },
                    weather: [{ main: 'Clouds', description: 'overcast clouds' }]
                })
            });

            const result = await getCityWeather('London', 'GB');

            expect(result).toEqual({
                cityName: 'London',
                country: 'GB',
                locationWeather: {
                    temp: 15.5,
                    feelsLike: 14.2,
                    humidity: 72,
                    tempMin: 13.0,
                    tempMax: 17.0,
                    windSpeedMph: 8.9,
                    rainVolumeLastHour: 0.5,
                    condition: 'Clouds',
                    description: 'overcast clouds'
                }
            });
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        it('should call geo API with correct city and country', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    main: { temp: 15, feels_like: 14, humidity: 70, temp_min: 13, temp_max: 17 }
                })
            });

            await getCityWeather('Paris', 'FR');

            expect(fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('q=Paris,FR'));
        });

        it('should call weather API with coordinates from geo API', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 48.8566, lon: 2.3522 }]
            });

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    main: { temp: 15, feels_like: 14, humidity: 70, temp_min: 13, temp_max: 17 }
                })
            });

            await getCityWeather('Paris', 'FR');

            expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('lat=48.8566'));
            expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('lon=2.3522'));
        });

        it('should default country to GB when not provided', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    main: { temp: 15, feels_like: 14, humidity: 70, temp_min: 13, temp_max: 17 }
                })
            });

            await getCityWeather('London');

            expect(fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('q=London,GB'));
        });

        it('should handle missing optional data (wind, rain, weather)', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    main: { temp: 15.5, feels_like: 14.2, humidity: 72, temp_min: 13.0, temp_max: 17.0 }
                })
            });

            const result = await getCityWeather('London', 'GB');

            expect(result.locationWeather.windSpeedMph).toBeNull();
            expect(result.locationWeather.rainVolumeLastHour).toBeNull();
            expect(result.locationWeather.condition).toBeNull();
            expect(result.locationWeather.description).toBeNull();
        });

        it('should throw NotFoundError when city not found', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => []
            });

            await expect(getCityWeather('InvalidCity', 'GB'))
                .rejects
                .toThrow(NotFoundError);
        });

        it('should throw ServiceUnavailableError when geo API fails', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(getCityWeather('London', 'GB'))
                .rejects
                .toThrow(ServiceUnavailableError);
        });

        it('should throw ServiceUnavailableError when weather API fails', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(getCityWeather('London', 'GB'))
                .rejects
                .toThrow(ServiceUnavailableError);
        });

        it('should throw ServiceUnavailableError when weather data is malformed', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

            await expect(getCityWeather('London', 'GB'))
                .rejects
                .toThrow(ServiceUnavailableError);
        });

        it('should throw ValidationError when city name is empty', async () => {
            await expect(getCityWeather('', 'GB'))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError when city name is whitespace', async () => {
            await expect(getCityWeather('   ', 'GB'))
                .rejects
                .toThrow(ValidationError);
        });
    });
});
