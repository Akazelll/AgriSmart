"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, CloudSun, Sunrise, CalendarClock } from "lucide-react";
import { RiMapPin2Line } from "react-icons/ri";

interface WeatherHeaderProps {
  locationName: string;
  countryCode: string;
}

export function WeatherHeader({
  locationName,
  countryCode,
}: WeatherHeaderProps) {
  const now = new Date();
  const [timeIcon, setTimeIcon] = useState<React.ReactNode>(
    <CalendarClock className='h-4 w-4 text-stone-500' />
  );

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
      setTimeIcon(<Sunrise className='h-6 w-6 text-yellow-500' />);
    } else if (hour >= 11 && hour < 15) {
      setTimeIcon(<Sun className='h-6 w-6 text-yellow-500' />);
    } else if (hour >= 15 && hour < 18) {
      setTimeIcon(<CloudSun className='h-6 w-6 text-yellow-500' />);
    } else {
      setTimeIcon(<Moon className='h-6 w-6 text-yellow-500' />);
    }
  }, []);

  return (
    <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-300/50 dark:border-stone-800 pb-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full bg-white dark:bg-stone-900 rounded-4xl p-2 shadow-sm border border-stone-100 '>
        <h1 className='text-xl font-small text-dark  flex items-center gap-1 tracking-tight px-4'>
          <RiMapPin2Line className='h-6 w-6 text-dark' />
          {locationName}
          <Badge
            variant='outline'
            className='ml-2 text-dark border-none font-normal shadow-md text-shadow-xs -translate-y-1'
          >
            {countryCode}
          </Badge>
        </h1>

        <div className='flex flex-row items-center'>
          {timeIcon}
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-dark px-4'>
              {now.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className='text-sm font-medium text-dark px-4 gap'>
              Pukul {" "}
              {now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
