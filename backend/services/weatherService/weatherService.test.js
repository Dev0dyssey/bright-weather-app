process.env.OPENWEATHER_API_KEY = 'test-api-key';

const { getCityWeather, _internal } = require('./weatherService');
const { getWeatherForLocation, getCoordinates } = _internal;

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

            await expect(getCoordinates('MockCity', 'GB'))
                .rejects
                .toThrow('We could not find MockCity in GB');
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

    describe('getWeatherForLocation', () => {
        it('should return weather data for valid coordinates', async () => {
            const mockWeatherData = {
                main: { temp: 15.5, feels_like: 14.2, humidity: 72 },
                wind: { speed: 3.5 },
                weather: [{ main: 'Clouds', description: 'overcast clouds' }]
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockWeatherData
            });

            const result = await getWeatherForLocation(51.5074, -0.1278);

            expect(result).toEqual(mockWeatherData);
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('lat=51.5074')
            );
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('lon=-0.1278')
            );
        });

        it('should throw error when API fails', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: async () => 'Server error'
            });

            await expect(getWeatherForLocation(51.5074, -0.1278))
                .rejects
                .toThrow('Weather service unavailable');
        });

        it('should throw error when response has no main data', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

            await expect(getWeatherForLocation(51.5074, -0.1278))
                .rejects
                .toThrow('Weather data is currently unavailable');
        });
    });

    describe('getCityWeather', () => {
        it('should return transformed weather data', async () => {
            // First call - getCoordinates
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            // Second call - getWeatherForLocation (raw API response)
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
                    wind: { speed: 4.0 },  // 4.0 m/s = 8.9 mph
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

        it('should handle missing optional data (rain, weather)', async () => {
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
                    wind: { speed: 4.0 }
                    // No rain or weather property
                })
            });

            const result = await getCityWeather('London', 'GB');

            expect(result.locationWeather.rainVolumeLastHour).toBeNull();
            expect(result.locationWeather.condition).toBeNull();
            expect(result.locationWeather.description).toBeNull();
        });

        it('should fail if getCoordinates fails', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => []  // No results
            });

            await expect(getCityWeather('MockCity', 'GB'))
                .rejects
                .toThrow('We could not find MockCity in GB');
        });

        it('should fail if getWeatherForLocation fails', async () => {
            // Coordinates succeed
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: 51.5074, lon: -0.1278 }]
            });

            // Weather fails
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: async () => 'Server error'
            });

            await expect(getCityWeather('London', 'GB'))
                .rejects
                .toThrow('Weather service unavailable');
        });
    });
});
