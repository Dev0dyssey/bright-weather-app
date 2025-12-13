const searchCityWeather = async(req, res) => {
    try {
        const { cityName, country} = req.query;
        console.log(`Searching for weather in ${cityName}, ${country}`);

        res.json({
            message: 'Route called successfully',
            cityName: cityName,
            country: country || null
        })
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