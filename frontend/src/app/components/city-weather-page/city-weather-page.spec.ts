import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CityWeatherPage } from './city-weather-page';
import { CityWeather } from '../../models/city-weather-interface';

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
    const mockCityWeather: CityWeather = {
      cityName: 'London',
      currentWeather: {
        weather: 'Clear',
        description: 'clear sky'
      },
      currentTemperature: 20,
      minTemperature: 15,
      maxTemperature: 25,
      feelsLikeTemperature: 19,
      humidity: 60,
      windSpeed: 10,
      lastHourRainVolume: 0
    };

    fixture.componentRef.setInput('cityWeather', mockCityWeather);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('City Weather for London');
  });

  it('should render weather details heading', () => {
    fixture.detectChanges();
    const detailsHeading = fixture.nativeElement.querySelector('h2');
    expect(detailsHeading?.textContent?.trim()).toBe('Weather details');
  });
});

