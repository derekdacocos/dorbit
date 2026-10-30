export type CityResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

// Finds cities matching what you typed, using Open-Meteo's free city search
export async function searchCities(query: string): Promise<CityResult[]> {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not search for cities");
  }
  const data = await response.json();
  return data.results ?? []; // no matches = no "results" at all, so use an empty list
}