const { getCityWeather } = require('../../services/weatherService/weatherService');

const searchCityWeather = async (req, res) => {
    try {
        const { cityName, country } = req.query;
        const weatherResult = await getCityWeather(cityName, country);
        res.json(weatherResult);
    } catch (error) {
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