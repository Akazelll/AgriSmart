"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, ArrowDown, ArrowUp, Wind } from "lucide-react";
import { WeatherData } from "@/types/weather";
import { MetricPill } from "./weather-ui";

export function CurrentWeatherCard({ data }: { data: WeatherData }) {
  return (
    <Card className='bg-gradient-to-br from-[#1a4d2e] to-[#143d24] dark:from-[#0a2915] dark:to-[#051a0d] text-white border-none shadow-xl rounded-2xl relative overflow-hidden'>
      <div className='absolute right-0 top-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left' />
      <CardContent className='p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8'>
        <div className='space-y-6 text-center md:text-left flex-1'>
          <div>
            <div className='text-7xl sm:text-8xl font-bold tracking-tighter leading-none'>
              {Math.round(data.main.temp)}°
            </div>
            <p className='text-emerald-100/80 text-lg mt-2 font-medium capitalize'>
              {data.weather[0].description}
            </p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-medium'>
            <MetricPill
              icon={<Thermometer size={16} />}
              label='Terasa'
              value={`${Math.round(data.main.feels_like)}°`}
            />
            <MetricPill
              icon={<ArrowDown size={16} />}
              label='Min'
              value={`${Math.round(data.main.temp_min)}°`}
            />
            <MetricPill
              icon={<ArrowUp size={16} />}
              label='Max'
              value={`${Math.round(data.main.temp_max)}°`}
            />
            <MetricPill
              icon={<Wind size={16} />}
              label='Gust'
              value={`${data.wind.gust || 0} m/s`}
            />
          </div>
        </div>
        <div className='shrink-0 relative'>
          <div className='absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full' />
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].description}
            className='relative w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-2xl'
          />
        </div>
      </CardContent>
    </Card>
  );
}
