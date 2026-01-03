import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanSearch, ArrowRight } from "lucide-react";

interface DashboardScanCardProps {
  totalScan: number;
}

export function DashboardScanCard({ totalScan }: DashboardScanCardProps) {
  return (
    <Card className='bg-gradient-to-br from-emerald-500 to-emerald-700 border-none text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-full'>
      {/* Watermark Icon */}
      <div className='absolute top-0 right-0 p-4 opacity-20'>
        <ScanSearch size={100} />
      </div>

      <CardHeader className='pb-2 relative z-10'>
        <CardTitle className='text-white/90 font-medium text-lg flex items-center gap-2'>
          <ScanSearch size={20} /> Cek Tanaman
        </CardTitle>
      </CardHeader>

      <CardContent className='relative z-10'>
        <div className='text-3xl font-bold mb-1'>{totalScan}</div>
        <p className='text-emerald-100 text-sm mb-4'>Total Tanaman Discan</p>

        <Link href='/prediction'>
          <Button
            variant='secondary'
            size='sm'
            className='rounded-full bg-white/20 hover:bg-white/30 text-white border-none w-full justify-between group'
          >
            Scan Sekarang
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
