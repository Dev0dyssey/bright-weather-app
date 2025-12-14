import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CityWeatherPage } from './city-weather-page';
import { CityWeatherResponse } from '../../models/city-weather-interface';

describe('CityWeatherPage', () => {
  let component: CityWeatherPage;
  let fixture: ComponentFixture<CityWeatherPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityWeatherPage],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CityWeatherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default city name when cityWeather input is not provided', () => {
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('Search for a city');
  });

  it('should display city name when cityWeather input is provided', () => {
    const mockCityWeather: CityWeatherResponse = {
      cityName: 'London',
      country: 'UK',
      locationWeather: {
        temp: 20,
        feelsLike: 19,
        humidity: 60,
        tempMin: 15,
        tempMax: 25,
        windSpeedMph: 10,
        rainVolumeLastHour: 0,
        condition: 'Clouds',
        description: 'overcast clouds'
      }
    };

    fixture.componentRef.setInput('cityWeather', mockCityWeather);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('London');
  });

  it('should render weather card when cityWeather is provided', () => {
    const mockCityWeather: CityWeatherResponse = {
      cityName: 'London',
      country: 'UK',
      locationWeather: {
        temp: 20,
        feelsLike: 19,
        humidity: 60,
        tempMin: 15,
        tempMax: 25,
        windSpeedMph: 10,
        rainVolumeLastHour: 0,
        condition: 'Clouds',
        description: 'overcast clouds'
      }
    };

    fixture.componentRef.setInput('cityWeather', mockCityWeather);
    fixture.detectChanges();

    const weatherCard = fixture.nativeElement.querySelector('.weather-card');
    expect(weatherCard).toBeTruthy();
  });

  it('should display error message when error input is provided', () => {
    const errorMessage = 'We could not find MockCity in GB. Please check the city name or try a different city';
    
    fixture.componentRef.setInput('error', errorMessage);
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-card p');
    expect(errorElement?.textContent?.trim()).toBe(errorMessage);
  });

  it('should not display weather card when error is present', () => {
    fixture.componentRef.setInput('error', 'Some error message');
    fixture.detectChanges();

    const weatherCard = fixture.nativeElement.querySelector('.weather-card');
    expect(weatherCard).toBeFalsy();
  });

  it('should not display prompt message when error is present', () => {
    fixture.componentRef.setInput('error', 'Some error message');
    fixture.detectChanges();

    const noDataMessage = fixture.nativeElement.querySelector('.no-data');
    expect(noDataMessage).toBeFalsy();
  });

  it('should display prompt message when no cityWeather and no error', () => {
    fixture.detectChanges();

    const noDataMessage = fixture.nativeElement.querySelector('.no-data');
    expect(noDataMessage?.textContent?.trim()).toBe('Enter a city name to see weather details');
  });
});

