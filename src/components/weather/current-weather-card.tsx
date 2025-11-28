"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Wind } from "lucide-react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { LiaThermometerHalfSolid } from "react-icons/lia";
import { WeatherData } from "@/types/weather";
import { MetricPill } from "./weather-ui";

export function CurrentWeatherCard({ data }: { data: WeatherData }) {
  return (
    <Card className='relative h-60  overflow-hidden bg-[#3A6F43] border-none shadow-xl rounded-[2.5rem] text-white flex flex-col justify-center'>
      <div className='absolute left-[50%] top-0 w-12 h-full bg-[#55A563]/40 -skew-x-12 origin-bottom-right' />
      <div className='absolute left-[58%] top-0 w-6 h-full bg-[#55A563]/40 -skew-x-12 origin-bottom-right' />

      <CardContent className='p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 font-normal'>
        <div className='space-y-6 text-center md:text-left flex-1 w-full'>
          <div>
            <p className='absolute right-[10%] top-22 sm:text-8xl text-4xl font-normal text-white tracking-tighter drop-shadow-2xl'>
              {Math.round(data.main.temp)}
            </p>
            <p className='absolute right-[7.5%] top-45 text-white text-lg mt-2 font-normal drop-shadow-2xl'>
              {data.weather[0].description.charAt(0).toUpperCase() +
                data.weather[0].description.slice(1)}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 w-full max-w-[300px] mt-auto items-center'>
            <MetricPill
              icon={<LiaThermometerHalfSolid size={32} />}
              label='Terasa'
              value={`${Math.round(data.main.feels_like)}`}
            />
            <MetricPill
              icon={<IoMdArrowDropup size={40} />}
              label='Max'
              value={`${Math.round(data.main.temp_max)}`}
            />
            <MetricPill
              icon={<Wind size={32} />}
              label='Gust'
              value={`${Math.round(data.wind.gust || data.wind.speed)}`}
            />
            <MetricPill
              icon={<IoMdArrowDropdown size={40} />}
              label='Min'
              value={`${Math.round(data.main.temp_min)}`}
            />
          </div>
        </div>

        <div className='shrink-0 relative'>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].description}
            className='relative w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-2xl -translate-y-4 -translate-x-28'
          />
        </div>
      </CardContent>
    </Card>
  );
}
