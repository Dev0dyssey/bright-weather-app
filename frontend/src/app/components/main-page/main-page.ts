import { Component, signal } from '@angular/core';
import { CitySearch } from '../city-search/city-search';
import { CityWeatherPage } from '../city-weather-page/city-weather-page';
import { CityWeather } from '../../models/city-weather-interface';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.html',
    styleUrls: ['./main-page.scss'],
    imports: [CitySearch, CityWeatherPage]
})
export class MainPage {
    readonly cityWeather = signal<CityWeather | undefined>(undefined);
}