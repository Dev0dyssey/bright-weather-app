import { Component, input } from '@angular/core';
import { CityWeather } from '../../models/city-weather-interface';

@Component({
    selector: 'app-city-weather-page',
    templateUrl: './city-weather-page.html',
    styleUrls: ['./city-weather-page.scss']
})
export class CityWeatherPage {
    readonly cityWeather = input<CityWeather>();
}