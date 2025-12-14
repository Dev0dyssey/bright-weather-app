import { Injectable } from '@angular/core';
import { CityWeatherResponse } from '../models/city-weather-interface';

@Injectable({
    providedIn: 'root'
})

export class WeatherService {
    private readonly baseUrl = 'http://localhost:3000';

    async searchCityWeather (cityName: string, country?: string): Promise<CityWeatherResponse> {
        const params = new URLSearchParams({ cityName });
        if (country) {
            params.append('country', country);
        }
    
        const response = await fetch(`${this.baseUrl}/search?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred while fetching weather data');
        }
        
        return data;
    }
}