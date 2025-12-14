# Bright Weather App

A weather application that displays current weather information for cities worldwide using the OpenWeatherMap API.

![Bright Weather App Screenshot](./screenshot.png)

## Features

- Search for weather by city name
- Support for multiple countries (UK, Canada, Germany, France, Australia, New Zealand, South Africa)
- Displays current weather conditions including:
  - Current temperature (°C)
  - "Feels like" temperature
  - Humidity percentage
  - Min/Max temperatures
  - Wind speed (mph)
  - Rain volume for the last hour (mm)
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- Angular 20 (with HttpClient, Signals, and standalone components)
- Angular Material
- Bootstrap 5 (utilities and grid)
- Bootstrap Icons
- TypeScript

### Backend
- Node.js
- Express.js
- OpenWeatherMap API

## Prerequisites

- Node.js (v18 or higher)
- npm
- OpenWeatherMap API key (free tier) — [Get one here](https://openweathermap.org/api)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/bright-weather-app.git
cd bright-weather-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
OPENWEATHER_API_KEY=your_api_key_here
Can use the key: 3527c33dd4c42b70091fb374279005bb
PORT=3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start the Backend

```bash
cd backend
npm start
```

The API will be available at `http://localhost:3000`

### Start the Frontend

In a separate terminal:

```bash
cd frontend
npm start
```

The application will be available at `http://localhost:4200`

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Endpoints

### GET /search

Search for weather data by city name.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cityName | string | Yes | Name of the city |
| country | string | No | ISO 3166-1 alpha-2 country code (default: GB) |

**Example:**
```
GET /search?cityName=London&country=GB
```

**Response:**
```json
{
  "cityName": "London",
  "country": "GB",
  "locationWeather": {
    "temp": 12.5,
    "feelsLike": 10.2,
    "humidity": 76,
    "tempMin": 10.0,
    "tempMax": 14.0,
    "windSpeedMph": 8.9,
    "rainVolumeLastHour": null,
    "condition": "Clouds",
    "description": "overcast clouds"
  }
}
```

## Project Structure

```
bright-weather-app/
├── backend/
│   ├── controllers/
│   │   └── searchController/
│   ├── routes/
│   ├── services/
│   │   └── weatherService/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── city-search/
│   │   │   │   ├── city-weather-page/
│   │   │   │   └── main-page/
│   │   │   ├── models/
│   │   │   └── services/
│   │   └── styles.scss
│   └── package.json
└── README.md
```

## Future Improvements

Some ideas for future improvements to the code, especially if this were to be taken to a more production ready state:

### High Priority

| Improvement | Description |
|-------------|-------------|
| **Environment configuration** | Use Angular environment files to manage API URLs for different environments (development, staging, production) |
| **Request timeout** | Add timeout handling for API calls to prevent hanging requests if OpenWeatherMap is slow/unresponsive |
| **CORS configuration** | Restrict CORS to specific origins in production instead of allowing all origins |
| **Logging infrastructure** | Implement proper logging |

### Medium Priority

| Improvement | Description |
|-------------|-------------|
| **Country validation** | Add server-side validation for country codes to provide clearer error messages |
| **Caching** | Implement caching for weather data to reduce API calls |

### Low Priority

| Improvement | Description |
|-------------|-------------|
| **Rate limiting** | Add rate limiting awareness for OpenWeatherMap API limits |
| **Health endpoint** | Add a `/health` endpoint for monitoring and health checks |
| **E2E tests** | Add end-to-end tests using Playwright or Cypress |

## License

MIT

## Author

Thomas Martin
