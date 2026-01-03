"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun, ArrowRight, MapPin } from "lucide-react";

interface WeatherState {
  temp: number;
  description: string;
  location: string;
}

export function DashboardWeatherCard() {
  const [data, setData] = useState<WeatherState | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const geoData = await geoRes.json();

          const address = geoData.address || {};
          const desaName =
            address.village ||
            address.suburb ||
            address.hamlet ||
            address.town ||
            address.city ||
            "Lokasi Anda";

          if (apiKey) {
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=id`
            );
            const weatherData = await weatherRes.json();

            if (weatherRes.ok) {
              setData({
                temp: Math.round(weatherData.main.temp),
                description: weatherData.weather[0].description,
                location: desaName,
              });
            }
          }
        } catch (err) {
          console.error("Gagal memuat data cuaca/lokasi", err);
        }
      },
      (err) => console.error("Izin lokasi ditolak", err)
    );
  }, []);

  return (
    <Card className='bg-gradient-to-br from-cyan-500 to-teal-600 border-none text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-full'>
      <div className='absolute top-0 right-0 p-4 opacity-20'>
        <CloudSun size={100} />
      </div>

      <CardHeader className='pb-2 relative z-10'>
        <CardTitle className='text-white/90 font-medium text-lg flex items-center gap-2'>
          <CloudSun size={20} /> Cuaca Hari Ini
        </CardTitle>
      </CardHeader>

      <CardContent className='relative z-10'>
        <div className='text-3xl font-bold mb-1'>
          {data ? `${data.temp}°C` : "--°C"}
        </div>

        <div className='text-sky-100 text-sm mb-4 flex flex-col gap-0.5'>
          {data ? (
            <>
              <span className='capitalize font-medium'>{data.description}</span>
              <div className='flex items-center gap-1 opacity-90'>
                <MapPin size={12} className='shrink-0' />
                <span className='truncate max-w-[180px] text-xs'>
                  {data.location}
                </span>
              </div>
            </>
          ) : (
            <span className='opacity-80 text-xs'>Menyiapkan data...</span>
          )}
        </div>

        <Link href='/weather'>
          <Button
            variant='secondary'
            size='sm'
            className='rounded-full bg-white/20 hover:bg-white/30 text-white border-none w-full justify-between group'
          >
            Lihat Detail
            <ArrowRight
              size={14}
              className='ml-1 transition-transform group-hover:translate-x-1'
            />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
