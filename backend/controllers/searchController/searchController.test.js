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

        it('should return 500 when service throws error', async () => {
            mockReq.query = { cityName: 'FakeCity', country: 'GB' };
            getCityWeather.mockRejectedValueOnce(new Error('No coordinates found'));

            await searchCityWeather(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Internal server error',
                message: 'No coordinates found'
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
