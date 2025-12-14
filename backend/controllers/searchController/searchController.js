const { getCoordinates } = require('../../services/weatherService/weatherService');

const searchCityWeather = async(req, res) => {
    try {
        const { cityName, country} = req.query;
        console.log(`Searching for weather in ${cityName}, ${country}`);
        const coordinates = await getCoordinates(cityName, country);
        res.json({ cityName, country, coordinates });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
};

module.exports = {
    searchCityWeather
}