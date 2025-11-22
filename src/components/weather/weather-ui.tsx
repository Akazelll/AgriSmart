// src/components/weather/weather-ui.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets } from "lucide-react";
import { ForecastItem } from "@/types/weather";

// --- Metric Pill (Untuk Card Utama) ---
export function MetricPill({
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

// --- Forecast Card (Kartu Prakiraan) ---
export function ForecastCard({
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

// --- Detail Card Small (Grid Details) ---
export function DetailCardSmall({
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

// --- Loading Skeleton ---
export function ProfessionalSkeleton() {
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

// --- Error State ---
export function ProfessionalError({ message }: { message: string }) {
  return (
    <div className='flex h-[60vh] w-full items-center justify-center p-6'>
      <div className='bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-md'>
        <p className='font-semibold'>{message}</p>
      </div>
    </div>
  );
}
