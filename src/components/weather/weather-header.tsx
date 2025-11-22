"use client";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, MapPin } from "lucide-react";

interface WeatherHeaderProps {
  locationName: string;
  countryCode: string;
}

export function WeatherHeader({
  locationName,
  countryCode,
}: WeatherHeaderProps) {
  return (
    <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-300/50 dark:border-stone-800 pb-4'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2 tracking-tight'>
          <MapPin className='h-6 w-6 text-emerald-700 dark:text-emerald-500' />
          {locationName}
          <Badge
            variant='outline'
            className='ml-2 text-stone-500 dark:text-stone-400 border-stone-300 dark:border-stone-700 font-normal'
          >
            {countryCode}
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
  );
}