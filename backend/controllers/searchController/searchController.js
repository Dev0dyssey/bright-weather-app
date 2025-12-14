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
        console.log(`Searching for weather in ${cityName}, ${country}`);
        const weatherResult = await getCityWeather(cityName, country);
        res.json(weatherResult);
    } catch (error) {
        console.error('Error searching for city weather:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
};

module.exports = {
    searchCityWeather
}