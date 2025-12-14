const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_BASE_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const msToMph = (ms) => Math.round(ms * 2.23694 * 10) / 10;

const getCoordinates = async (cityName, country = 'GB') => {
    const url = `${GEO_BASE_URL}?q=${cityName},${country}&limit=1&appid=${API_KEY}`;
    try {
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

const getWeatherForLocation = async (lat, lon) => {
    const url = `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Weather API status:', response.status);
            console.error('Weather API error:', errorBody);
            throw new Error('Weather service unavailable, please try again later');
        }
        const data = await response.json();
        console.log('Weather data:', data);
        if (!data || !data.main) {
            throw new Error('No current weather data found for the given location');
        }
        return data;
    } catch (error) {
        console.error('Error getting weather for location:', error);
        throw error;
    }
};

const getCityWeather = async (cityName, country = 'GB') => {
    const { lat, lon } = await getCoordinates(cityName, country);
    const rawWeatherData = await getWeatherForLocation(lat, lon);
    return {
        cityName,
        country,
        locationWeather: {
            temp: rawWeatherData.main.temp,
            feelsLike: rawWeatherData.main.feels_like,
            humidity: rawWeatherData.main.humidity,
            tempMin: rawWeatherData.main.temp_min,
            tempMax: rawWeatherData.main.temp_max,
            windSpeedMph: msToMph(rawWeatherData.wind.speed),
            rainVolumeLastHour: rawWeatherData.rain?.['1h'] ?? null
        }
    }
};

module.exports = {
    getCoordinates,
    getWeatherForLocation,
    getCityWeather
}