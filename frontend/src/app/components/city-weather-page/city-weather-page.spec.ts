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
    expect(heading?.textContent?.trim()).toBe('City Weather for Default City Name');
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
        rainVolumeLastHour: 0
      }
    };

    fixture.componentRef.setInput('cityWeather', mockCityWeather);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('City Weather for London');
  });

  it('should render weather details heading when cityWeather is provided', () => {
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
        rainVolumeLastHour: 0
      }
    };

    fixture.componentRef.setInput('cityWeather', mockCityWeather);
    fixture.detectChanges();

    const detailsHeading = fixture.nativeElement.querySelector('h2');
    expect(detailsHeading?.textContent?.trim()).toBe('Weather details');
  });

  it('should display error message when error input is provided', () => {
    const errorMessage = 'We could not find MockCity in GB. Please check the city name or try a different city';
    
    fixture.componentRef.setInput('error', errorMessage);
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement?.textContent?.trim()).toBe(errorMessage);
  });

  it('should not display weather details when error is present', () => {
    fixture.componentRef.setInput('error', 'Some error message');
    fixture.detectChanges();

    const weatherDetails = fixture.nativeElement.querySelector('h2');
    expect(weatherDetails).toBeFalsy();
  });

  it('should not display "No weather data available" when error is present', () => {
    fixture.componentRef.setInput('error', 'Some error message');
    fixture.detectChanges();

    const noDataMessage = fixture.nativeElement.querySelector('p:not(.error)');
    expect(noDataMessage?.textContent?.trim()).not.toBe('No weather data available');
  });

  it('should display "No weather data available" when no cityWeather and no error', () => {
    fixture.detectChanges();

    const paragraphs = fixture.nativeElement.querySelectorAll('p');
    const noDataMessage = Array.from(paragraphs).find(
      (p: any) => p.textContent?.trim() === 'No weather data available'
    );
    expect(noDataMessage).toBeTruthy();
  });
});

