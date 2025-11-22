"use client";
import { Droplets, Gauge, Wind, Eye, Sunrise, Sunset } from "lucide-react";
import { DetailCardSmall } from "./weather-ui";
import { WeatherData } from "@/types/weather";

export function WeatherDetailsGrid({ data }: { data: WeatherData }) {
  return (
    <div className='grid grid-cols-2 gap-3'>
      <DetailCardSmall
        title='Kelembapan'
        icon={<Droplets className='h-4 w-4 text-blue-500' />}
        value={`${data.main.humidity}%`}
      />
      <DetailCardSmall
        title='Tekanan'
        icon={<Gauge className='h-4 w-4 text-stone-500' />}
        value={`${data.main.pressure} hPa`}
      />
      <DetailCardSmall
        title='Angin'
        icon={<Wind className='h-4 w-4 text-sky-500' />}
        value={`${data.wind.speed} m/s`}
      />
      <DetailCardSmall
        title='Visibilitas'
        icon={<Eye className='h-4 w-4 text-indigo-500' />}
        value={`${data.visibility / 1000} km`}
      />
      <DetailCardSmall
        title='Terbit'
        icon={<Sunrise className='h-4 w-4 text-orange-500' />}
        value={new Date(data.sys.sunrise * 1000).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
      <DetailCardSmall
        title='Terbenam'
        icon={<Sunset className='h-4 w-4 text-indigo-500' />}
        value={new Date(data.sys.sunset * 1000).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
}
