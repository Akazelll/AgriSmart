import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ScanSearch,
  History,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiseaseChart } from "@/components/dashboard/disease-chart";
import { DashboardWeatherCard } from "@/components/dashboard/weather-card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch User Data
  const { data: user } = await supabase
    .from("users")
    .select("name")
    .eq("email", session.user.email)
    .single();

  // Fetch All History for Chart
  const { data: allHistory } = await supabase
    .from("scan_history")
    .select("label, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  // Fetch Recent History (Limit 3)
  const { data: recentHistory } = await supabase
    .from("scan_history")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // --- LOGIC BARU: Fetch Transactions ---
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", session.user.id);

  // Hitung Keuangan
  const totalIncome =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const totalExpense =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const currentBalance = totalIncome - totalExpense;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };
  // --------------------------------------

  // Calculate Chart Data
  const diseaseCounts: Record<string, number> = {};

  allHistory?.forEach((item) => {
    const label = item.label || "Unknown";
    diseaseCounts[label] = (diseaseCounts[label] || 0) + 1;
  });

  const chartData = Object.entries(diseaseCounts)
    .map(([disease, count], index) => {
      const colors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
      return {
        disease,
        count,
        fill: colors[index % colors.length],
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalScan = allHistory?.length || 0;

  return (
    <div className='min-h-screen bg-[#F8FAF8] p-4 md:p-8 font-sans rounded-4xl'>
      <div className='flex flex-col gap-2 mb-6'>
        <h1 className='text-3xl font-bold text-stone-800'>
          Halo, {user?.name || "Petani Cerdas"}! 👋
        </h1>
        <p className='text-stone-500'>
          Berikut adalah ringkasan aktivitas pertanian Anda hari ini.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Weather Card */}
        <DashboardWeatherCard />

        {/* Scan Action Card */}
        <Card className='bg-gradient-to-br from-emerald-600 to-emerald-700 border-none text-white shadow-lg relative overflow-hidden flex flex-col justify-between'>
          <div className='absolute top-0 right-0 p-4 opacity-20'>
            <ScanSearch size={100} />
          </div>
          <CardHeader className='pb-2'>
            <CardTitle className='text-white/90 font-medium text-lg flex items-center gap-2'>
              <ScanSearch size={20} /> Cek Tanaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold mb-1'>{totalScan}</div>
            <p className='text-emerald-100 text-sm mb-4'>
              Total Tanaman Discan
            </p>
            <Link href='/prediction'>
              <Button
                variant='secondary'
                size='sm'
                className='rounded-full bg-white/20 hover:bg-white/30 text-white border-none'
              >
                Scan Sekarang <ArrowRight size={14} className='ml-1' />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Financial Summary Card (NEW DYNAMIC CONTENT) */}
        <Card className='bg-white border-stone-200 shadow-sm flex flex-col justify-between'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-stone-700 font-medium text-lg flex items-center gap-2'>
              <Wallet size={20} className='text-stone-500' /> Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <p className='text-xs text-stone-500 font-medium uppercase tracking-wider'>
                  Saldo Saat Ini
                </p>
                <div className='text-2xl font-bold text-stone-800 mt-1 truncate'>
                  {formatRupiah(currentBalance)}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 pt-2 border-t border-stone-100'>
                <div className='flex flex-col'>
                  <span className='text-[10px] text-stone-400 flex items-center gap-1'>
                    <TrendingUp size={12} className='text-emerald-500' /> Masuk
                  </span>
                  <span className='font-semibold text-emerald-600 text-sm truncate'>
                    {formatRupiah(totalIncome)}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-[10px] text-stone-400 flex items-center gap-1'>
                    <TrendingDown size={12} className='text-rose-500' /> Keluar
                  </span>
                  <span className='font-semibold text-rose-600 text-sm truncate'>
                    {formatRupiah(totalExpense)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Disease Trend Chart */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-stone-800 flex items-center gap-2'>
              <TrendingUp size={20} className='text-stone-400' /> Tren Penyakit
            </h2>
          </div>

          {chartData.length > 0 ? (
            <DiseaseChart data={chartData} />
          ) : (
            <Card className='flex flex-col items-center justify-center h-[300px] border-dashed bg-stone-50/50 shadow-none'>
              <p className='text-stone-400 font-medium'>
                Belum ada data statistik
              </p>
              <p className='text-stone-400 text-xs'>
                Lakukan scan tanaman terlebih dahulu
              </p>
            </Card>
          )}
        </div>

        {/* Recent History */}
        <div className='lg:col-span-1 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-stone-800 flex items-center gap-2'>
              <History size={20} className='text-stone-400' /> Terakhir
            </h2>
            <Link
              href='/penyakit'
              className='text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1'
            >
              Semua <ArrowRight size={14} />
            </Link>
          </div>

          <div className='flex flex-col gap-4'>
            {!recentHistory || recentHistory.length === 0 ? (
              <Card className='border-dashed border-stone-200 bg-stone-50/50 shadow-none py-8'>
                <div className='flex flex-col items-center text-center text-stone-400 gap-2'>
                  <AlertCircle size={32} />
                  <p>Belum ada aktivitas.</p>
                </div>
              </Card>
            ) : (
              recentHistory.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all'
                >
                  <div className='relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0'>
                    <Image
                      src={item.image_url}
                      alt={item.label}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-bold text-stone-800 text-sm truncate'>
                      {item.label}
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
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        item.confidence > 80
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.confidence}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
