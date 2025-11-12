"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent,} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Thermometer,
  Wind,
  Sunrise,
  Sunset,
  MapPin,
  Gauge,
  Eye,
  ArrowDown,
  ArrowUp,
  Clock,
  CalendarClock,
} from "lucide-react";

const WeatherMap = dynamic(() => import("@/components/weather-map"), {
  ssr: false,
  loading: () => <Skeleton className='h-full w-full rounded-2xl' />, 
});

interface WeatherData {
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

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
  pop: number;
}

interface ForecastData {
  list: ForecastItem[];
}

export default function WeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
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

        switch (err.code) {
          case err.PERMISSION_DENIED:
            userMessage =
              "Izin lokasi ditolak. Mohon aktifkan di pengaturan browser Anda.";
            break;
          case err.POSITION_UNAVAILABLE:
            userMessage = "Informasi lokasi tidak tersedia saat ini.";
            break;
          case err.TIMEOUT:
            userMessage =
              "Waktu permintaan lokasi habis. Coba refresh halaman.";
            break;
        }

        setError(userMessage);
        setLoading(false);
      },

      {
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 0,
      }
    );
  }, []);

  const fetchAllWeatherData = async (lat: number, lon: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("API Key tidak ditemukan");

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        ),
      ]);

      if (!weatherRes.ok || !forecastRes.ok)
        throw new Error("Gagal mengambil data cuaca dari server.");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setCurrentWeather(weatherData);
      setForecast(forecastData);
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
    <div className='min-h-screen w-full bg-[#f4f5f0] dark:bg-[#0c0c0c] p-4 md:p-6 lg:p-8 space-y-6'>
      {/* --- Header --- */}
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-300/50 dark:border-stone-800 pb-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2 tracking-tight'>
            <MapPin className='h-6 w-6 text-emerald-700 dark:text-emerald-500' />
            {currentWeather.name}
            <Badge
              variant='outline'
              className='ml-2 text-stone-500 dark:text-stone-400 border-stone-300 dark:border-stone-700 font-normal'
            >
              {currentWeather.sys.country}
            </Badge>
          </h1>
          <p className='text-stone-500 dark:text-stone-400 mt-1.5 text-sm flex items-center gap-2'>
            <CalendarClock className='h-4 w-4' />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </header>

      {/* --- Layout Utama dengan Peta --- */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Kolom Kiri (8/12): Hero Card + Forecast */}
        <div className='lg:col-span-8 space-y-6'>
          {/* Hero Card */}
          <Card className='bg-gradient-to-br from-[#1a4d2e] to-[#143d24] dark:from-[#0a2915] dark:to-[#051a0d] text-white border-none shadow-xl rounded-2xl relative overflow-hidden'>
            <div className='absolute right-0 top-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left' />
            <CardContent className='p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8'>
              <div className='space-y-6 text-center md:text-left flex-1'>
                <div>
                  <div className='text-7xl sm:text-8xl font-bold tracking-tighter leading-none'>
                    {Math.round(currentWeather.main.temp)}°
                  </div>
                  <p className='text-emerald-100/80 text-lg mt-2 font-medium capitalize'>
                    {currentWeather.weather[0].description}
                  </p>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-medium'>
                  <MetricPill
                    icon={<Thermometer size={16} />}
                    label='Terasa'
                    value={`${Math.round(currentWeather.main.feels_like)}°`}
                  />
                  <MetricPill
                    icon={<ArrowDown size={16} />}
                    label='Min'
                    value={`${Math.round(currentWeather.main.temp_min)}°`}
                  />
                  <MetricPill
                    icon={<ArrowUp size={16} />}
                    label='Max'
                    value={`${Math.round(currentWeather.main.temp_max)}°`}
                  />
                  <MetricPill
                    icon={<Wind size={16} />}
                    label='Gust'
                    value={`${currentWeather.wind.gust || 0} m/s`}
                  />
                </div>
              </div>
              <div className='shrink-0 relative'>
                <div className='absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full' />
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                  alt={currentWeather.weather[0].description}
                  className='relative w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-2xl'
                />
              </div>
            </CardContent>
          </Card>

          <section>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2'>
                <Clock className='h-5 w-5 text-emerald-600' />
                Prakiraan 24 Jam Kedepan
              </h2>
            </div>
            <div className='flex overflow-x-auto pb-4 -mx-1 px-1 gap-3 snap-x no-scrollbar'>
              {forecast.list.slice(0, 8).map((item, i) => (
                <ForecastCard key={item.dt} item={item} isFirst={i === 0} />
              ))}
            </div>
          </section>
        </div>

        <div className='lg:col-span-4 space-y-6'>
          <Card className='border-none shadow-md overflow-hidden rounded-2xl h-[300px] lg:h-[350px] relative z-0'>
            {currentWeather.coord && (
              <WeatherMap
                lat={currentWeather.coord.lat}
                lon={currentWeather.coord.lon}
                locationName={currentWeather.name}
              />
            )}
          </Card>

          <div className='grid grid-cols-2 gap-3'>
            <DetailCardSmall
              title='Kelembapan'
              icon={<Droplets className='h-4 w-4 text-blue-500' />}
              value={`${currentWeather.main.humidity}%`}
            />
            <DetailCardSmall
              title='Tekanan'
              icon={<Gauge className='h-4 w-4 text-stone-500' />}
              value={`${currentWeather.main.pressure} hPa`}
            />
            <DetailCardSmall
              title='Angin'
              icon={<Wind className='h-4 w-4 text-sky-500' />}
              value={`${currentWeather.wind.speed} m/s`}
            />
            <DetailCardSmall
              title='Visibilitas'
              icon={<Eye className='h-4 w-4 text-indigo-500' />}
              value={`${currentWeather.visibility / 1000} km`}
            />
            <DetailCardSmall
              title='Terbit'
              icon={<Sunrise className='h-4 w-4 text-orange-500' />}
              value={new Date(
                currentWeather.sys.sunrise * 1000
              ).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <DetailCardSmall
              title='Terbenam'
              icon={<Sunset className='h-4 w-4 text-indigo-500' />}
              value={new Date(
                currentWeather.sys.sunset * 1000
              ).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='flex flex-col items-center p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5'>
      <div className='text-emerald-200 mb-1'>{icon}</div>
      <div className='text-xs text-emerald-100/70 uppercase tracking-wider font-semibold'>
        {label}
      </div>
      <div className='font-bold'>{value}</div>
    </div>
  );
}

function ForecastCard({
  item,
  isFirst,
}: {
  item: ForecastItem;
  isFirst: boolean;
}) {
  return (
    <Card
      className={`min-w-[140px] snap-start border-stone-200/60 dark:border-stone-800 ${
        isFirst
          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50"
          : "bg-white dark:bg-stone-900"
      }`}
    >
      <CardContent className='p-4 flex flex-col items-center text-center space-y-2'>
        <p className='text-sm font-semibold text-stone-600 dark:text-stone-300'>
          {new Date(item.dt * 1000).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
          alt={item.weather[0].description}
          className='w-14 h-14 -my-1'
        />
        <p className='text-xl font-bold text-stone-800 dark:text-stone-100'>
          {Math.round(item.main.temp)}°
        </p>
        <div className='flex items-center gap-1 text-xs text-stone-400'>
          <Droplets size={12} /> {Math.round(item.pop * 100)}%
        </div>
      </CardContent>
    </Card>
  );
}

function DetailCardSmall({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <Card className='border-stone-200/60 dark:border-stone-800 shadow-sm bg-white dark:bg-stone-900/50'>
      <CardContent className='p-3 flex flex-col justify-between h-full'>
        <div className='flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-2'>
          {icon}
          <span className='text-xs font-medium uppercase tracking-wider'>
            {title}
          </span>
        </div>
        <p className='text-lg font-bold text-stone-800 dark:text-stone-100 truncate'>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}


function ProfessionalSkeleton() {
  return (
    <div className='p-6 space-y-8 min-h-screen bg-[#f4f5f0] dark:bg-[#0c0c0c]'>
      <Skeleton className='h-10 w-1/3' />
      <div className='grid lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-8 space-y-6'>
          <Skeleton className='h-[350px] rounded-3xl' />
          <Skeleton className='h-[180px] rounded-2xl' />
        </div>
        <div className='lg:col-span-4 space-y-6'>
          <Skeleton className='h-[300px] rounded-3xl' />
          <div className='grid grid-cols-2 gap-3'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-24 rounded-xl' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalError({ message }: { message: string }) {
  return (
    <div className='flex h-[60vh] w-full items-center justify-center p-6'>
      <div className='bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-md'>
        <p className='font-semibold'>{message}</p>
      </div>
    </div>
  );
}
