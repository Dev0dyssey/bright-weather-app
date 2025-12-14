const { getCityWeather } = require('../../services/weatherService/weatherService');

const searchCityWeather = async(req, res) => {
    try {
        const { cityName, country} = req.query;
        if (!cityName) {
            return res.status(400).json({
                error: 'City name is required',
                message: 'Please provide a city name to search for weather'
            });
        }
        const weatherResult = await getCityWeather(cityName, country);
        res.json(weatherResult);
    } catch (error) {
        console.error('Error searching for city weather:', error);

        const statusCode = error.statusCode || 500;
        const errorName = error.name || 'InternalServerError';

        res.status(statusCode).json({
            error: errorName,
            message: error.message
        });
    }
};

module.exports = {
    searchCityWeather
};