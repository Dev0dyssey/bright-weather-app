import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MainPageComponent } from './main-page';
import { WeatherService } from '../../services/search-store';
import { CityWeatherResponse } from '../../models/city-weather-interface';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let weatherServiceSpy: jasmine.SpyObj<WeatherService>;

    const mockWeatherResponse: CityWeatherResponse = {
        cityName: 'London',
        country: 'GB',
        locationWeather: {
            temp: 15,
            feelsLike: 13,
            humidity: 72,
            tempMin: 12,
            tempMax: 18,
            windSpeedMph: 8.5,
            rainVolumeLastHour: null,
            condition: 'Clouds',
            description: 'overcast clouds'
        }
    };

    beforeEach(async () => {
        weatherServiceSpy = jasmine.createSpyObj('WeatherService', ['searchCityWeather']);

        await TestBed.configureTestingModule({
            imports: [MainPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                { provide: WeatherService, useValue: weatherServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initial state', () => {
        it('should have undefined cityWeather', () => {
            expect(component.cityWeather()).toBeUndefined();
        });

        it('should have undefined error', () => {
            expect(component.error()).toBeUndefined();
        });

        it('should have isLoading set to false', () => {
            expect(component.isLoading()).toBeFalse();
        });
    });

    describe('onSearch', () => {
        it('should call weatherService with cityName and country', async () => {
            weatherServiceSpy.searchCityWeather.and.resolveTo(mockWeatherResponse);

            await component.onSearch({ cityName: 'London', country: 'GB' });

            expect(weatherServiceSpy.searchCityWeather).toHaveBeenCalledWith('London', 'GB');
        });

        it('should set cityWeather on successful search', async () => {
            weatherServiceSpy.searchCityWeather.and.resolveTo(mockWeatherResponse);

            await component.onSearch({ cityName: 'London', country: 'GB' });

            expect(component.cityWeather()).toEqual(mockWeatherResponse);
        });

        it('should clear error on successful search', async () => {
            weatherServiceSpy.searchCityWeather.and.rejectWith(new Error('Previous error'));
            await component.onSearch({ cityName: 'InvalidCity', country: 'GB' });
            expect(component.error()).toBeDefined();

            weatherServiceSpy.searchCityWeather.and.resolveTo(mockWeatherResponse);
            await component.onSearch({ cityName: 'London', country: 'GB' });

            expect(component.error()).toBeUndefined();
        });

        it('should set isLoading to false after successful search', async () => {
            weatherServiceSpy.searchCityWeather.and.resolveTo(mockWeatherResponse);

            await component.onSearch({ cityName: 'London', country: 'GB' });

            expect(component.isLoading()).toBeFalse();
        });

        it('should set error when search fails', async () => {
            const errorMessage = 'We could not find MockCity in GB';
            weatherServiceSpy.searchCityWeather.and.rejectWith(new Error(errorMessage));

            await component.onSearch({ cityName: 'MockCity', country: 'GB' });

            expect(component.error()).toBe(errorMessage);
        });

        it('should clear cityWeather when search fails', async () => {
            weatherServiceSpy.searchCityWeather.and.resolveTo(mockWeatherResponse);
            await component.onSearch({ cityName: 'London', country: 'GB' });
            expect(component.cityWeather()).toBeDefined();

            weatherServiceSpy.searchCityWeather.and.rejectWith(new Error('City not found'));
            await component.onSearch({ cityName: 'MockCity', country: 'GB' });

            expect(component.cityWeather()).toBeUndefined();
        });

        it('should set isLoading to false after failed search', async () => {
            weatherServiceSpy.searchCityWeather.and.rejectWith(new Error('Error'));

            await component.onSearch({ cityName: 'MockCity', country: 'GB' });

            expect(component.isLoading()).toBeFalse();
        });

        it('should handle non-Error exceptions gracefully', async () => {
            weatherServiceSpy.searchCityWeather.and.rejectWith('String error');

            await component.onSearch({ cityName: 'MockCity', country: 'GB' });

            expect(component.error()).toBe('An error has occurred');
        });
    });

    describe('onClearSearch', () => {
        it('should clear cityWeather', async () => {
            weatherServiceSpy.searchCityWeather.and.resolveTo(mockWeatherResponse);
            await component.onSearch({ cityName: 'London', country: 'GB' });

            component.onClearSearch();

            expect(component.cityWeather()).toBeUndefined();
        });

        it('should clear error', async () => {
            weatherServiceSpy.searchCityWeather.and.rejectWith(new Error('Error'));
            await component.onSearch({ cityName: 'MockCity', country: 'GB' });

            component.onClearSearch();

            expect(component.error()).toBeUndefined();
        });

        it('should set isLoading to false', () => {
            component.onClearSearch();

            expect(component.isLoading()).toBeFalse();
        });
    });

    describe('template rendering', () => {
        it('should render the header with app title', () => {
            const header = fixture.nativeElement.querySelector('.app-header h1');
            expect(header?.textContent).toContain('Bright Weather');
        });

        it('should render the city search component', () => {
            const searchComponent = fixture.nativeElement.querySelector('app-city-search');
            expect(searchComponent).toBeTruthy();
        });

        it('should render the city weather page component', () => {
            const weatherPageComponent = fixture.nativeElement.querySelector('app-city-weather-page');
            expect(weatherPageComponent).toBeTruthy();
        });
    });
});
