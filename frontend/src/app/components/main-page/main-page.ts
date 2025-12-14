import { Component, inject, signal } from '@angular/core';
import { CitySearchComponent } from '../city-search/city-search';
import { CityWeatherPageComponent } from '../city-weather-page/city-weather-page';
import { CityWeatherResponse } from '../../models/city-weather-interface';
import { WeatherService } from '../../services/search-store';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.html',
    styleUrls: ['./main-page.scss'],
    imports: [CitySearchComponent, CityWeatherPageComponent]
})
export class MainPage {
    private readonly weatherService = inject(WeatherService);
    readonly cityWeather = signal<CityWeatherResponse | undefined>(undefined);
    readonly error = signal<string | undefined>(undefined);

    async onSearch(searchParams: { cityName: string, country: string }): Promise<void> {
        try {
            this.error.set(undefined);
            const data = await this.weatherService.searchCityWeather(searchParams.cityName, searchParams.country);
            this.cityWeather.set(data);
        } catch (error) {
            this.cityWeather.set(undefined);
            this.error.set(error instanceof Error ? error.message : 'An error has occurred');
        }
    }

    onClearSearch(): void {
        this.cityWeather.set(undefined);
        this.error.set(undefined);
    }
}