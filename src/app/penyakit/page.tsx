import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Sprout,
  ArrowRight,
  Activity,
  SearchX,
} from "lucide-react";

export default async function PenyakitPage() {
  // 1. Cek Sesi
  const session = await auth();
  if (!session?.user) redirect("/login");

  // 2. Setup Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Fetch Data
  const { data: histories } = await supabase
    .from("scan_history")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  // Helper untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper untuk warna badge berdasarkan confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90)
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
    if (confidence >= 70)
      return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
    return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
  };

  return (
    <div className='min-h-screen bg-stone-50/40 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* --- Header Section --- */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-emerald-50 rounded-2xl text-emerald-600'>
              <Sprout size={32} />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-stone-800'>
                Riwayat Diagnosa
              </h1>
              <p className='text-stone-500 text-sm'>
                Pantau jejak kesehatan tanaman padi Anda.
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3 bg-stone-50 px-5 py-3 rounded-2xl border border-stone-100'>
            <div className='text-right'>
              <p className='text-xs font-semibold text-stone-400 uppercase tracking-wider'>
                Total Scan
              </p>
              <p className='text-2xl font-bold text-stone-800 leading-none'>
                {histories?.length || 0}
              </p>
            </div>
            <Activity className='text-stone-300 h-8 w-8' />
          </div>
        </div>

        {/* --- List Section --- */}
        <div className='space-y-4'>
          {!histories || histories.length === 0 ? (
            // Empty State
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-stone-200 text-center'>
              <div className='bg-stone-50 p-6 rounded-full mb-4'>
                <SearchX className='h-10 w-10 text-stone-400' />
              </div>
              <h3 className='text-lg font-semibold text-stone-600'>
                Belum ada riwayat
              </h3>
              <p className='text-stone-400 max-w-xs mx-auto mt-1'>
                Lakukan deteksi penyakit pada tanaman Anda untuk melihat riwayat
                di sini.
              </p>
            </div>
          ) : (
            // History List
            histories.map((item) => (
              <Link
                href={`/penyakit/${item.id}`}
                key={item.id}
                className='block'
              >
                <div className='group relative flex flex-col sm:flex-row bg-white rounded-[2rem] p-4 gap-6 border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer'>
                  {/* Image Section */}
                  <div className='relative h-64 sm:h-48 sm:w-48 shrink-0 rounded-3xl overflow-hidden bg-stone-100'>
                    <Image
                      src={item.image_url}
                      alt={item.label}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent sm:hidden' />
                  </div>

                  {/* Content Section */}
                  <div className='flex flex-col flex-1 py-1 pr-2 space-y-4'>
                    {/* Title & Badge */}
                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2'>
                      <div>
                        <h3 className='text-xl font-bold text-stone-800 group-hover:text-emerald-700 transition-colors'>
                          {item.label}
                        </h3>
                        <div className='flex items-center gap-2 text-xs font-medium text-stone-400 mt-1'>
                          <CalendarDays size={14} />
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                      <Badge
                        variant='outline'
                        className={`w-fit px-3 py-1 text-xs font-semibold border ${getConfidenceColor(
                          item.confidence
                        )}`}
                      >
                        {item.confidence}% Akurat
                      </Badge>
                    </div>

                    {/* Description / Solution Snippet */}
                    <div className='flex-1'>
                      <div className='bg-stone-50/50 p-4 rounded-2xl border border-stone-100 group-hover:bg-emerald-50/30 transition-colors'>
                        <p className='text-sm text-stone-600 line-clamp-2 leading-relaxed'>
                          <span className='font-semibold text-stone-700'>
                            Solusi:{" "}
                          </span>
                          {item.solution || "Tidak ada data solusi."}
                        </p>
                      </div>
                    </div>

                    {/* Action (Visual Only) */}
                    <div className='flex items-center justify-end'>
                      <span className='text-xs font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0'>
                        Lihat Detail Lengkap <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
