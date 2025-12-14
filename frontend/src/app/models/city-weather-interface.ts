export interface CityWeatherResponse {
    cityName: string;
    country: string;
    locationWeather: LocationWeather;
}

export interface LocationWeather {
    temp: number;
    feelsLike: number;
    humidity: number;
    tempMin: number;
    tempMax: number;
    windSpeedMph: number;
    rainVolumeLastHour: number | null;
}