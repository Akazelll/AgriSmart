import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { History, ArrowRight, AlertCircle, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { DiseaseChart } from "@/components/dashboard/disease-chart";
import { DashboardWeatherCard } from "@/components/dashboard/weather-card";
import { DashboardScanCard } from "@/components/dashboard/scan-card";
import { DashboardFinanceCard } from "@/components/dashboard/finance-card";

function getGreeting() {
  const hour = parseInt(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "numeric",
      hour12: false,
    })
  );

  if (hour >= 4 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [userData, historyData, transactionData] = await Promise.all([
    supabase
      .from("users")
      .select("name")
      .eq("email", session.user.email)
      .single(),

    supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", session.user.id),
  ]);

  const user = userData.data;
  const allHistory = historyData.data || [];
  const transactions = transactionData.data || [];

  const totalScan = allHistory.length;
  const recentHistory = allHistory.slice(0, 3);

  const diseaseMap: Record<string, number> = {};
  allHistory.forEach((item) => {
    const label = item.label ? item.label.trim() : "Tidak Teridentifikasi";
    diseaseMap[label] = (diseaseMap[label] || 0) + 1;
  });

  const chartData = Object.entries(diseaseMap).map(([disease, count]) => ({
    disease,
    count,
  }));

  return (
    <div className='min-h-screen bg-[#F8FAF8] p-4 md:p-8 font-sans pb-24 rounded-4xl'>
      <div className='flex flex-col gap-1 mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-stone-800'>
          {getGreeting()}, {user?.name || "Petani Cerdas"}! 👋
        </h1>
        <p className='text-stone-500 text-sm md:text-base'>
          Ringkasan aktivitas pertanian Anda hari ini.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch'>
        <div className='h-full'>
          <DashboardWeatherCard />
        </div>
        <div className='h-full'>
          <DashboardScanCard totalScan={totalScan} />
        </div>
        <div className='h-full'>
          <DashboardFinanceCard transactions={transactions} />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 flex flex-col gap-4'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='text-stone-400' size={20} />
            <h2 className='text-lg font-bold text-stone-700'>
              Statistik Penyakit
            </h2>
          </div>
          <div className='h-full min-h-[300px]'>
            <DiseaseChart data={chartData} totalScan={totalScan} />
          </div>
        </div>

        <div className='lg:col-span-1 flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <History className='text-stone-400' size={20} />
              <h2 className='text-lg font-bold text-stone-700'>Terakhir</h2>
            </div>
            <Link
              href='/penyakit'
              className='text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1'
            >
              Semua <ArrowRight size={14} />
            </Link>
          </div>

          <div className='flex flex-col gap-3'>
            {recentHistory.length > 0 ? (
              recentHistory.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ item }: { item: any }) {
  return (
    <div className='flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all group'>
      <div className='relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100'>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.label}
            fill
            className='object-cover group-hover:scale-110 transition-transform duration-500'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-stone-200'>
            <span className='text-[10px] text-stone-500'>No Img</span>
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <h4 className='font-bold text-stone-800 text-sm truncate'>
          {item.label || "Tanpa Label"}
        </h4>
        <p className='text-[10px] text-stone-500'>
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className='text-right shrink-0'>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
            item.confidence > 80
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-100"
          }`}
        >
          {item.confidence ? `${Math.round(item.confidence)}%` : "-"}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className='border-dashed border-stone-200 bg-stone-50/50 shadow-none py-8'>
      <div className='flex flex-col items-center text-center text-stone-400 gap-2'>
        <AlertCircle size={32} className='opacity-50' />
        <p className='text-sm font-medium'>Belum ada aktivitas.</p>
        <p className='text-xs'>Scan tanaman Anda sekarang!</p>
      </div>
    </Card>
  );
}
