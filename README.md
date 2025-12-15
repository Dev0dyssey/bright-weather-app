# Bright Weather App

A weather application that displays current weather information for cities internationally using the OpenWeatherMap API.

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
- Angular 20
- Angular Material
- Bootstrap 5
- Bootstrap Icons
- TypeScript

### Backend
- Node.js
- Express.js
- OpenWeatherMap API

## Prerequisites

- Node.js (v18 or higher)
- npm
- OpenWeatherMap API key - see below

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
OPENWEATHER_API_KEY=your_api_key_here (Can use the key: 3527c33dd4c42b70091fb374279005bb)
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

### GET /api/v1/search

Search for weather data by city name.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cityName | string | Yes | Name of the city |
| country | string | No | ISO 3166-1 alpha-2 country code (default: GB) |

**Example:**
```
GET /api/v1/search?cityName=London&country=GB
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

### Architecture & Configuration

| Improvement | Description |
|-------------|-------------|
| **Environment configuration** | Use Angular environment files to manage API URLs across development, staging, and production environments |
| **Centralised error middleware** | Replace per-controller `try/catch` blocks with Express error-handling middleware for consistency |

### Security & Reliability

| Improvement | Description |
|-------------|-------------|
| **CORS restriction** | Lock down CORS to specific origins in production instead of allowing all |
| **Request timeouts** | Add timeout handling for external API calls to prevent hanging requests |
| **Country code validation** | Validate country codes server-side against a whitelist to provide clearer error messages |
| **Rate limiting** | Implement rate limiting to stay within OpenWeatherMap API quotas |

### Code Quality & Developer Experience

| Improvement | Description |
|-------------|-------------|
| **ESLint configuration** | Add linting rules to enforce consistent code style across the codebase |
| **Pre-commit hooks** | Use Husky + lint-staged to run linting and tests before commits |
| **Shared constants** | Extract hardcoded values (countries list, debounce time, etc.) into shared constant files |

### Testing & Monitoring

| Improvement | Description |
|-------------|-------------|
| **E2E tests** | Add end-to-end tests using Playwright or Cypress for critical user flows |
| **Health endpoint** | Add a `/health` endpoint for monitoring and health checks |
| **Response caching** | Cache weather data briefly to reduce API calls and improve response times |

## License

MIT

## Author

Thomas Martin
