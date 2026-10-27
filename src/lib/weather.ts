export type WeatherData = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    weather_code: number[];
  };
};

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,weather_code" +
    "&daily=temperature_2m_max,weather_code" +
    "&timezone=auto&forecast_days=4";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not load the weather");
  }
  return response.json();
}

export function describeWeather(code: number) {
  if (code === 0) return { label: "Clear sky", icon: "☀️" };
  if (code <= 2) return { label: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { label: "Cloudy", icon: "☁️" };
  if (code <= 48) return { label: "Foggy", icon: "🌫️" };
  if (code <= 57) return { label: "Drizzle", icon: "🌦️" };
  if (code <= 67) return { label: "Rain", icon: "🌧️" };
  if (code <= 77) return { label: "Snow", icon: "❄️" };
  if (code <= 82) return { label: "Rain showers", icon: "🌧️" };
  if (code <= 86) return { label: "Snow showers", icon: "❄️" };
  return { label: "Thunderstorm", icon: "⛈️" };
}