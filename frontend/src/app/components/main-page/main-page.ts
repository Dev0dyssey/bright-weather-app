import { Component, signal } from '@angular/core';
import { CitySearch } from '../city-search/city-search';
import { CityWeatherPage } from '../city-weather-page/city-weather-page';
import { CityWeatherResponse } from '../../models/city-weather-interface';
import { searchCityWeather } from '../../services/search-store';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.html',
    styleUrls: ['./main-page.scss'],
    imports: [CitySearch, CityWeatherPage]
})
export class MainPage {
    readonly cityWeather = signal<CityWeatherResponse | undefined>(undefined);

    async onSearch(query: string): Promise<void> {
        console.log('Searching for:', query);
        const data = await searchCityWeather(query);
        console.log('Data:', data);
        this.cityWeather.set(data);
    }

    onClearSearch(): void {
        this.cityWeather.set(undefined);
    }
}