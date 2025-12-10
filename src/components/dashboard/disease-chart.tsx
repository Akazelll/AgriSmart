"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Jumlah Scan",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

interface DiseaseChartProps {
  data: {
    disease: string;
    count: number;
    fill: string;
  }[];
}

export function DiseaseChart({ data }: DiseaseChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("count");

  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  );

  return (
    <Card className='flex flex-col border-stone-200 shadow-sm'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b border-stone-100 p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Statistik Penyakit</CardTitle>
          <CardDescription>
            Frekuensi penyakit yang terdeteksi pada lahan Anda.
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-stone-100 bg-stone-50/50 px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6'>
            <span className='text-xs text-stone-500'>Total Scan</span>
            <span className='text-lg font-bold leading-none sm:text-3xl'>
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='disease'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return value.length > 10 ? value.slice(0, 10) + "..." : value;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className='w-[180px]'
                  nameKey='count'
                  labelKey='disease'
                />
              }
            />
            <Bar
              dataKey='count'
              fill='var(--color-count)'
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey='count'
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
