import { Component, computed, input } from '@angular/core';
import { CityWeatherResponse } from '../../models/city-weather-interface';

@Component({
    selector: 'app-city-weather-page',
    templateUrl: './city-weather-page.html',
    styleUrls: ['./city-weather-page.scss']
})
export class CityWeatherPageComponent {
    readonly cityWeather = input<CityWeatherResponse>();
    readonly error = input<string>();

    readonly weather = computed(() => this.cityWeather()?.locationWeather);
}