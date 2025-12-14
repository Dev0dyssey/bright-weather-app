const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const MS_TO_MPH_CONVERSION = 2.23694;

const msToMph = (ms) => Math.round(ms * MS_TO_MPH_CONVERSION * 10) / 10;

const validateApiKey = () => {
    if (!API_KEY) {
        throw new Error('OpenWeather API key is not set');
    }
}

const getCoordinates = async (cityName, country = 'GB') => {
    validateApiKey();

    if (!cityName?.trim()) {
        throw new Error('City name is required and cannot be empty');
    }

    const url = `${GEO_BASE_URL}?q=${encodeURIComponent(cityName)},${country}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather service unavailable, please try again later');
    }
    const data = await response.json();
    if (!data || data.length === 0) {
        throw new Error(`We could not find ${cityName} in ${country}. Please check the city name or try a different city`);
    }
    const { lat, lon } = data[0];
    return { lat, lon };
};

const getWeatherForLocation = async (lat, lon) => {
    validateApiKey();
    const url = `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather service unavailable, please try again later');
    }
    const data = await response.json();
    if (!data || !data.main) {
        throw new Error('Weather data is currently unavailable for this location. Please try again later');
    }
    return data;
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
            rainVolumeLastHour: rawWeatherData.rain?.['1h'] ?? null,
            condition: rawWeatherData.weather?.[0]?.main ?? null,
            description: rawWeatherData.weather?.[0]?.description ?? null
        }
    }
};

module.exports = {
    getCoordinates,
    getWeatherForLocation,
    getCityWeather
}