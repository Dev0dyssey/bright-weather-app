export interface CityWeather {
    cityName: string;
    currentWeather: CurrentWeather;
    currentTemperature: number;
    minTemperature: number;
    maxTemperature: number;
    feelsLikeTemperature: number;
    humidity: number;
    windSpeed: number;
    lastHourRainVolume: number;
}

export interface CurrentWeather {
    weather: string;
    description: string;
}