"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";

interface WeatherData {
  weather: { description: string; icon: string; main: string }[];
  main: { temp: number; humidity: number; feels_like: number };
  wind: { speed: number };
  name: string;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          setError("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
      setLoading(false);
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

      console.log("API Key yang digunakan:", apiKey);

      if (!apiKey) {
        throw new Error(
          "API Key tidak ditemukan. Pastikan sudah set NEXT_PUBLIC_OPENWEATHER_API_KEY di .env.local"
        );
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

      console.log("Fetching URL:", url);

      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error API: ${res.status}`);
      }

      const data = await res.json();
      console.log("Data berhasil didapat:", data);
      setWeather(data);
    } catch (err) {
      console.error("Error fetchWeather:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Cuaca di {weather?.name}
        </h2>
        {weather && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className='w-16 h-16'
          />
        )}
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Suhu</CardTitle>
            <Thermometer className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(weather?.main.temp || 0)}°C
            </div>
            <p className='text-xs text-muted-foreground capitalize'>
              Terasa seperti {Math.round(weather?.main.feels_like || 0)}°C
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Kondisi</CardTitle>
            <Cloud className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold capitalize'>
              {weather?.weather[0].main}
            </div>
            <p className='text-xs text-muted-foreground capitalize'>
              {weather?.weather[0].description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Kelembaban</CardTitle>
            <Droplets className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{weather?.main.humidity}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Kecepatan Angin
            </CardTitle>
            <Wind className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{weather?.wind.speed} m/s</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
