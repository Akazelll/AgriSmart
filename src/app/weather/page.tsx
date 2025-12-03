"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { WeatherData, ForecastData } from "@/types/weather";
import {
  ProfessionalSkeleton,
  ProfessionalError,
  ForecastCard,
} from "@/components/weather/weather-ui";
import { WeatherHeader } from "@/components/weather/weather-header";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
// WeatherDetailsGrid sudah dihapus/tidak di-import

const WeatherMap = dynamic(() => import("@/components/weather-map"), {
  ssr: false,
  loading: () => <Skeleton className='h-full w-full rounded-2xl' />,
});

export default function WeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Perangkat Anda tidak mendukung fitur lokasi otomatis.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchAllWeatherData(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("Gagal mendapatkan lokasi:", err.message);
        let userMessage = "Gagal mendapatkan lokasi Anda.";
        if (err.code === err.PERMISSION_DENIED)
          userMessage =
            "Izin lokasi ditolak. Mohon aktifkan di pengaturan browser.";
        else if (err.code === err.POSITION_UNAVAILABLE)
          userMessage = "Informasi lokasi tidak tersedia.";
        else if (err.code === err.TIMEOUT)
          userMessage = "Waktu permintaan lokasi habis.";

        setError(userMessage);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  const fetchAllWeatherData = async (lat: number, lon: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("API Key tidak ditemukan");

      const [weatherRes, forecastRes, geoRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        ),
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
          { headers: { "User-Agent": "AgriSmart-App" } }
        ),
      ]);

      if (!weatherRes.ok || !forecastRes.ok)
        throw new Error("Gagal mengambil data cuaca.");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
      const geoData = await geoRes.json();

      const address = geoData.address || {};
      const kelurahan =
        address.village ||
        address.suburb ||
        address.residential ||
        address.quarter ||
        weatherData.name;

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setLocationName(kelurahan);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ProfessionalSkeleton />;
  if (error) return <ProfessionalError message={error} />;
  if (!currentWeather || !forecast) return null;

  return (
    <div className='w-full min-h-screen bg-white/50 drop-shadow-2xl rounded-4xl p-4 md:p-6 lg:p-8 space-y-8'>
      <WeatherHeader
        locationName={locationName || currentWeather.name}
        countryCode={currentWeather.sys.country}
      />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8'>
          <CurrentWeatherCard data={currentWeather} />
        </div>

        <div className='lg:col-span-4'>
          <Card className='border-none shadow-xl bg-white p-3 rounded-[2.5rem] h-60 lg:h-full min-h-[240px] relative z-0'>
            <div className='h-full w-full rounded-[2rem] overflow-hidden relative z-0'>
              {currentWeather.coord && (
                <WeatherMap
                  lat={currentWeather.coord.lat}
                  lon={currentWeather.coord.lon}
                  locationName={locationName || currentWeather.name}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
      <section className='w-full'>
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full'>
          {forecast.list.slice(0, 8).map((item, i) => (
            <ForecastCard key={item.dt} item={item} isFirst={i === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
