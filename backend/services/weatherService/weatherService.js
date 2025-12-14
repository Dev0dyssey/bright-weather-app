const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_BASE_URL = 'http://api.openweathermap.org/geo/1.0/direct';

const getCoordinates = async (cityName, country = 'GB') => {
    try{
    const url = `${GEO_BASE_URL}?q=${cityName},${country}&limit=1&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather service unavailable, please try again later');
    }
    const data = await response.json();
    console.log('Data:', data);
    if (!data || data.length === 0) {
        throw new Error(`No coordinates found for ${cityName} in ${country}`);
    }
    const { lat, lon } = data[0];
    console.log(`Coordinates found for ${cityName} in ${country}: ${lat}, ${lon}`);
    return { lat, lon };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        throw error;
    }
};

module.exports = {
    getCoordinates
}