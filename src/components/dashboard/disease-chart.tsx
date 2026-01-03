"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Kasus",
    color: "#10b981",
  },
} satisfies ChartConfig;

interface DiseaseChartProps {
  data: {
    disease: string;
    count: number;
  }[];
  totalScan: number;
}

// Helper penyingkat label
function shortLabel(val: string) {
  if (val.length > 15) {
    return val.split(" ").slice(0, 2).join(" ");
  }
  return val;
}

export function DiseaseChart({ data, totalScan }: DiseaseChartProps) {
  const { chartData, topDisease, maxCount } = React.useMemo(() => {
    // Sorting data agar Radar Chart terlihat rapi
    const sortedData = [...data].sort((a, b) =>
      a.disease.localeCompare(b.disease)
    );

    const max = sortedData.reduce((m, x) => Math.max(m, x.count), 0);
    const sortedByCount = [...sortedData].sort((a, b) => b.count - a.count);
    const top = sortedByCount[0]?.count > 0 ? sortedByCount[0] : null;

    return { chartData: sortedData, topDisease: top, maxCount: max };
  }, [data]);

  const topPct =
    topDisease && totalScan > 0
      ? Math.round((topDisease.count / totalScan) * 100)
      : 0;

  return (
    <Card className='flex flex-col h-full w-full border-stone-200 shadow-sm rounded-xl overflow-hidden bg-white'>
      {/* Header Compact */}
      <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b border-stone-100 bg-stone-50/40'>
        <div className='flex items-center gap-2'>
          <div className='p-1.5 bg-white border border-stone-100 rounded-md shadow-sm hidden sm:block'>
            <TrendingUp size={14} className='text-emerald-600' />
          </div>
          <div>
            <h3 className='text-sm font-bold text-stone-700 leading-tight'>
              Peta Sebaran
            </h3>
            <p className='text-[10px] text-stone-400 font-medium'>
              Data Real-time
            </p>
          </div>
        </div>

        <div className='text-right'>
          <div className='inline-flex items-center justify-center rounded-md bg-white border border-stone-200 px-2 py-1 shadow-sm'>
            <span className='text-xs font-bold text-stone-800'>
              {totalScan}{" "}
              <span className='text-[10px] text-stone-400 font-normal ml-0.5'>
                Scan
              </span>
            </span>
          </div>
        </div>
      </CardHeader>

      {/* FIXED: Hapus class 'opacity-0' dan animasi CSS manual yang bikin bug */}
      <div className='flex-1 w-full relative min-h-[300px]'>
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className='mx-auto w-full h-full absolute inset-0'
          >
            <RadarChart data={chartData} outerRadius='60%'>
              <PolarGrid className='stroke-stone-200' gridType='circle' />

              <PolarAngleAxis
                dataKey='disease'
                tick={{ fill: "#78716c", fontSize: 10, fontWeight: 600 }}
                tickFormatter={shortLabel}
              />

              <PolarRadiusAxis
                angle={90}
                domain={[0, Math.max(1, maxCount)]}
                tick={false}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator='line'
                    className='bg-white/95 backdrop-blur border-stone-200 text-xs shadow-md'
                  />
                }
              />

              <Radar
                name='Kasus'
                dataKey='count'
                stroke='#10b981'
                strokeWidth={2.5}
                fill='#10b981'
                fillOpacity={0.25}
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0, fillOpacity: 1 }}
                activeDot={{ r: 6, fill: "#047857", strokeWidth: 0 }}
                // Animasi halus tetap ada, tapi dikontrol oleh Library Recharts (Lebih Aman)
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                animationEasing='ease-out'
              />
            </RadarChart>
          </ChartContainer>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-stone-400'>
            <p className='text-xs'>Belum ada data scan.</p>
          </div>
        )}

        {topDisease && (
          <div className='absolute bottom-3 right-3 text-[10px] bg-emerald-50/90 backdrop-blur border border-emerald-100 px-2 py-1 rounded-md text-emerald-700 shadow-sm'>
            Dominan: <strong>{shortLabel(topDisease.disease)}</strong> ({topPct}
            %)
          </div>
        )}
      </div>
    </Card>
  );
}
