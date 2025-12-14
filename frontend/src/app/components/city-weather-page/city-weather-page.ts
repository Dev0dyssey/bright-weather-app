import { Component, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CityWeatherResponse } from '../../models/city-weather-interface';

@Component({
    selector: 'app-city-weather-page',
    templateUrl: './city-weather-page.html',
    styleUrls: ['./city-weather-page.scss'],
    imports: [MatProgressSpinnerModule]
})
export class CityWeatherPageComponent {
    readonly cityWeather = input<CityWeatherResponse>();
    readonly error = input<string>();
    readonly isLoading = input<boolean>(false);

    readonly weather = computed(() => this.cityWeather()?.locationWeather);
}