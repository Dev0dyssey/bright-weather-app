export const searchCityWeather = async (cityName: string, country?: string) => {
    const params = new URLSearchParams({ cityName });
    if (country) {
        params.append('country', country);
    }

    const response = await fetch(`http://localhost:3000/search?${params.toString()}`);
    const data = await response.json();
    return data;
}