"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun, ArrowRight, Loader2, MapPinOff } from "lucide-react";

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
  name: string;
}

export function DashboardWeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Lokasi tidak didukung");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

          if (!apiKey) throw new Error("API Key missing");

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=id`
          );

          if (!res.ok) throw new Error("Gagal mengambil data");

          const data = await res.json();
          setWeather(data);
        } catch (err) {
          setError("Gagal memuat cuaca");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Akses lokasi ditolak");
        setLoading(false);
      }
    );
  }, []);

  return (
    <Card className='bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white shadow-lg relative overflow-hidden h-full'>
      <div className='absolute top-0 right-0 p-4 opacity-20'>
        <CloudSun size={100} />
      </div>
      <CardHeader className='pb-2'>
        <CardTitle className='text-white/90 font-medium text-lg flex items-center gap-2'>
          <CloudSun size={20} /> Cuaca Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='flex flex-col gap-2 py-2'>
            <Loader2 className='animate-spin h-8 w-8 text-white/50' />
            <p className='text-blue-100 text-sm'>Mencari lokasi...</p>
          </div>
        ) : error ? (
          <div className='flex flex-col gap-2 py-2'>
            <div className='flex items-center gap-2 text-blue-100'>
              <MapPinOff size={20} />
              <span className='text-sm font-medium'>{error}</span>
            </div>
            <p className='text-xs text-blue-200'>Aktifkan GPS untuk melihat</p>
          </div>
        ) : weather ? (
          <>
            <div className='text-4xl font-bold mb-1'>
              {Math.round(weather.main.temp)}°C
            </div>
            <p className='text-blue-100 text-sm mb-4 capitalize'>
              {weather.weather[0].description} • {weather.name}
            </p>
          </>
        ) : null}

        <Link href='/weather'>
          <Button
            variant='secondary'
            size='sm'
            className='rounded-full bg-white/20 hover:bg-white/30 text-white border-none mt-1'
          >
            Lihat Detail <ArrowRight size={14} className='ml-1' />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
