process.env.OPENWEATHER_API_KEY = 'test-api-key';
const { searchCityWeather } = require('./searchController');
const { getCityWeather } = require('../../services/weatherService/weatherService');

jest.mock('../../services/weatherService/weatherService');

describe('searchController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            query: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('searchCityWeather', () => {
        it('should return weather data for valid city', async () => {
            const mockWeatherResult = {
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
            };

            mockReq.query = { cityName: 'London', country: 'GB' };
            getCityWeather.mockResolvedValueOnce(mockWeatherResult);

            await searchCityWeather(mockReq, mockRes);

            expect(getCityWeather).toHaveBeenCalledWith('London', 'GB');
            expect(mockRes.json).toHaveBeenCalledWith(mockWeatherResult);
        });

        it('should return 400 when cityName is missing', async () => {
            mockReq.query = { country: 'GB' };  // No cityName

            await searchCityWeather(mockReq, mockRes);

            expect(getCityWeather).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'City name is required',
                message: 'Please provide a city name to search for weather'
            });
        });

        it('should return 404 when city not found', async () => {
            const { NotFoundError } = require('../../utils/errors');
            
            mockReq.query = { cityName: 'MockCity', country: 'GB' };
            getCityWeather.mockRejectedValueOnce(
                new NotFoundError('We could not find MockCity in GB')
            );

            await searchCityWeather(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'NotFoundError',
                message: 'We could not find MockCity in GB'
            });
        });

        it('should return 503 when service unavailable', async () => {
            const { ServiceUnavailableError } = require('../../utils/errors');
            
            mockReq.query = { cityName: 'London', country: 'GB' };
            getCityWeather.mockRejectedValueOnce(
                new ServiceUnavailableError('Weather service unavailable')
            );

            await searchCityWeather(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(503);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'ServiceUnavailableError',
                message: 'Weather service unavailable'
            });
        });

        it('should return 500 for unexpected errors', async () => {
            mockReq.query = { cityName: 'London', country: 'GB' };
            getCityWeather.mockRejectedValueOnce(new Error('Unexpected error'));

            await searchCityWeather(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Error',
                message: 'Unexpected error'
            });
        });

        it('should work without country parameter', async () => {
            const mockWeatherResult = {
                cityName: 'London',
                country: undefined,
                locationWeather: {
                    temp: 15.5,
                    feelsLike: 14.2,
                    humidity: 72,
                    tempMin: 13.0,
                    tempMax: 17.0,
                    windSpeedMph: 8.9,
                    rainVolumeLastHour: null,
                    condition: 'Clear',
                    description: 'clear sky'
                }
            };

            mockReq.query = { cityName: 'London' };  // No country
            getCityWeather.mockResolvedValueOnce(mockWeatherResult);

            await searchCityWeather(mockReq, mockRes);

            expect(getCityWeather).toHaveBeenCalledWith('London', undefined);
            expect(mockRes.json).toHaveBeenCalledWith(mockWeatherResult);
        });
    });
});
