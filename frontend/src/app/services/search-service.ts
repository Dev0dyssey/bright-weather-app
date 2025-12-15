import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CityWeatherResponse } from '../models/city-weather-interface';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:3000/api/v1';

    async searchCityWeather(cityName: string, country?: string): Promise<CityWeatherResponse> {
        let params = new HttpParams().set('cityName', cityName);
        if (country) {
            params = params.set('country', country);
        }

        try {
            return await firstValueFrom(this.http.get<CityWeatherResponse>(`${this.baseUrl}/search`, { params }));
        }
        catch (error) {
            if (error instanceof HttpErrorResponse) {
                throw new Error(error.error?.message || 'An error occurred while fetching weather data');
            }
            throw error;
        }
    }
}