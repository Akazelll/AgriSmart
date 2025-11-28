"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets } from "lucide-react";
import { ForecastItem } from "@/types/weather";
import { cn } from "@/lib/utils";

export function MetricPill({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center px-4 py-2 bg-white/34 rounded-full backdrop-blur-md border border-white/10 shadow-sm w-full",
        className
      )}
    >
      <div className='text-white mr-3 shrink-0 drop-shadow-sm'>{icon}</div>

      <div className='flex flex-col items-start'>
        <span className='text-[11px] text-white capitalize tracking-wider font-normal leading-tight mb-0.5 drop-shadow-sm'>
          {label}
        </span>
        <span className='font-normal text-2xl text-white leading-none drop-shadow-md'>
          {value}
        </span>
      </div>
    </div>
  );
}

export function ForecastCard({
  item,
  isFirst, // Prop ini bisa tetap ada jika parent mengirimnya, tapi tidak kita gunakan untuk styling lagi
}: {
  item: ForecastItem;
  isFirst: boolean;
}) {
  return (
    <Card
      className='
        snap-start 
        shrink-0 
        min-w-[140px] 
        h-[220px] 
        rounded-[3rem] 
        border
        transition-all
        duration-300
        bg-white 
        border-stone-200/60 
        shadow-sm
        hover:shadow-md  /* Opsional: efek hover agar interaktif */
      '
    >
      <CardContent className=' flex flex-col items-center justify-between h-full'>
        <p className='text-3xl font-normal tracking-tighter text-stone-800'>
          {new Date(item.dt * 1000)
            .toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
            }
        </p>
        <div className='flex flex-col items-center gap-2'>
          <div className='relative w-20 h-20 flex items-center justify-center'>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`}
              alt={item.weather[0].description}
              className='w-full h-full object-contain drop-shadow-md'
            />
          </div>

          <p className='text-sm font-normal text-dark capitalize text-center '>
            {item.weather[0].description}
          </p>
        </div>
        <p className='text-3xl font-normal tracking-tight text-stone-800'>
          {Math.round(item.main.temp)}
          <span className='text-2xl align-top ml-1'></span>
        </p>
      </CardContent>
    </Card>
  );
}

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

export function ProfessionalSkeleton() {
  return (
    <div className='p-6 space-y-8 min-h-screen bg-[#f4f5f0] dark:bg-[#0c0c0c] rounded-4xl'>
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

export function ProfessionalError({ message }: { message: string }) {
  return (
    <div className='flex h-[60vh] w-full items-center justify-center p-6'>
      <div className='bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-md'>
        <p className='font-semibold'>{message}</p>
      </div>
    </div>
  );
}
