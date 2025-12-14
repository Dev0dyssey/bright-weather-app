const { searchCityWeather } = require('./searchController');
const { getCoordinates } = require('../../services/weatherService/weatherService');

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
    it('should return coordinates for valid city', async () => {
      mockReq.query = { cityName: 'London', country: 'GB' };
      getCoordinates.mockResolvedValueOnce({ lat: 51.5074, lon: -0.1278 });

      await searchCityWeather(mockReq, mockRes);

      expect(getCoordinates).toHaveBeenCalledWith('London', 'GB');
      expect(mockRes.json).toHaveBeenCalledWith({
        cityName: 'London',
        country: 'GB',
        coordinates: { lat: 51.5074, lon: -0.1278 }
      });
    });

    it('should return 500 when service throws error', async () => {
      mockReq.query = { cityName: 'FakeCity', country: 'GB' };
      getCoordinates.mockRejectedValueOnce(new Error('No coordinates found'));

      await searchCityWeather(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'No coordinates found'
      });
    });
  });
});