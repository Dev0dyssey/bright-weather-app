const BASE_URL = 'http://localhost:3000';

export const searchCityWeather = async (cityName: string, country?: string) => {
    const params = new URLSearchParams({ cityName });
    if (country) {
        params.append('country', country);
    }

    const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
    const data = await response.json();
    return data;
}