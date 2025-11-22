// src/types/weather.ts

export interface WeatherData {
  weather: { description: string; icon: string; main: string }[];
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
    grnd_level?: number;
  };
  wind: { speed: number; deg: number; gust?: number };
  sys: { sunrise: number; sunset: number; country: string };
  name: string;
  coord: { lat: number; lon: number };
  dt: number;
  visibility: number;
  clouds: { all: number };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
  pop: number;
}

export interface ForecastData {
  list: ForecastItem[];
}
