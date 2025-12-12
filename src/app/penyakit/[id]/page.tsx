import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  ThermometerSun,
  ScanLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Definisi Tipe Data untuk Params
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PenyakitDetailPage({ params }: PageProps) {
  // 1. Ambil ID dari URL (Wajib await di Next.js terbaru)
  const { id } = await params;

  // 2. Cek Sesi Pengguna
  const session = await auth();
  if (!session?.user) redirect("/login");

  // 3. Setup Supabase Client
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 4. Ambil Data Detail dari Database
  const { data: scan, error } = await supabase
    .from("scan_history")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !scan) {
    return notFound();
  }

  // Tentukan warna badge berdasarkan confidence score
  const isHighConfidence = scan.confidence >= 80;
  const isMediumConfidence = scan.confidence >= 50 && scan.confidence < 80;

  let badgeColor = "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
  let badgeText = "Akurasi Rendah";

  if (isHighConfidence) {
    badgeColor =
      "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    badgeText = "Sangat Akurat";
  } else if (isMediumConfidence) {
    badgeColor =
      "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    badgeText = "Perlu Verifikasi";
  }

  return (
    <div className='min-h-screen bg-[#F8FAF8] px-4 py-6 md:p-8 flex justify-center pb-20'>
      <div className='w-full max-w-6xl space-y-6'>
        {/* --- Tombol Kembali --- */}
        <Link href='/penyakit'>
          <Button
            variant='ghost'
            className='pl-0 hover:bg-transparent text-stone-500 hover:text-emerald-700 transition-colors group'
          >
            <ArrowLeft className='mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1' />
            Kembali ke Riwayat
          </Button>
        </Link>

        {/* --- Layout Grid Utama --- */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start'>
          {/* --- KOLOM KIRI: Gambar & Statistik --- */}
          {/* Perbaikan Mobile: sticky hanya aktif di layar besar (lg) */}
          <div className='lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit'>
            {/* Wrapper Gambar */}
            <div className='relative aspect-square w-full overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-stone-100 shadow-xl border-4 border-white group'>
              <Image
                src={scan.image_url}
                alt={scan.label}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out'
                priority
              />

              {/* Overlay info scan di atas gambar (Mobile Friendly) */}
              <div className='absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent lg:hidden'>
                <div className='flex items-center gap-2 text-white/90 text-xs font-medium'>
                  <ScanLine size={14} />
                  <span>
                    Diambil pada{" "}
                    {new Date(scan.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Kartu Statistik Ringkas */}
            <Card className='rounded-3xl border-stone-100 shadow-sm bg-white overflow-hidden'>
              <CardContent className='p-0 divide-y divide-stone-100'>
                {/* Confidence */}
                <div className='p-5 md:p-6 flex items-center justify-between hover:bg-stone-50/50 transition-colors'>
                  <div className='flex items-center gap-4'>
                    <div className='p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0'>
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className='text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider'>
                        Tingkat Keyakinan
                      </p>
                      <p className='text-sm md:text-base font-semibold text-stone-700'>
                        Analisis AI
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xl md:text-2xl font-bold ${
                      isHighConfidence ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {scan.confidence}%
                  </span>
                </div>

                {/* Tanggal */}
                <div className='p-5 md:p-6 flex items-center justify-between hover:bg-stone-50/50 transition-colors'>
                  <div className='flex items-center gap-4'>
                    <div className='p-2.5 bg-blue-50 rounded-2xl text-blue-600 shrink-0'>
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <p className='text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider'>
                        Waktu Scan
                      </p>
                      <p className='text-sm md:text-base font-semibold text-stone-700'>
                        {new Date(scan.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-xs font-medium text-stone-400 bg-stone-100 px-2 py-1 rounded-lg'>
                      {new Date(scan.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- KOLOM KANAN: Detail & Solusi --- */}
          <div className='lg:col-span-7 space-y-6'>
            {/* Header Judul */}
            <div className='bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col gap-4'>
              <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
                <div>
                  <h1 className='text-2xl md:text-4xl font-extrabold text-stone-800 leading-tight mb-2'>
                    {scan.label}
                  </h1>
                  <p className='text-sm md:text-base text-stone-500'>
                    Hasil identifikasi penyakit tanaman padi.
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className={`w-fit px-4 py-1.5 text-xs md:text-sm font-semibold border rounded-full backdrop-blur-sm ${badgeColor}`}
                >
                  {badgeText}
                </Badge>
              </div>
            </div>

            {/* Konten Utama */}
            <div className='bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8'>
              {/* Bagian Deskripsi */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-blue-50 p-2 rounded-xl text-blue-600'>
                    <Info size={20} />
                  </div>
                  <h3 className='text-lg md:text-xl font-bold text-stone-800'>
                    Tentang Penyakit
                  </h3>
                </div>
                <div className='bg-stone-50/80 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-stone-100'>
                  <p className='text-stone-600 leading-relaxed text-sm md:text-lg text-justify'>
                    {scan.description ||
                      "Tidak ada informasi deskripsi tersedia untuk penyakit ini."}
                  </p>
                </div>
              </div>

              <Separator className='bg-stone-100' />

              {/* Bagian Solusi */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-emerald-50 p-2 rounded-xl text-emerald-600'>
                    <ThermometerSun size={20} />
                  </div>
                  <h3 className='text-lg md:text-xl font-bold text-stone-800'>
                    Rekomendasi Penanganan
                  </h3>
                </div>

                <div className='bg-gradient-to-br from-emerald-50/80 to-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100/50 shadow-sm'>
                  <div className='flex gap-4'>
                    <div className='shrink-0 mt-0.5'>
                      <CheckCircle2 className='h-5 w-5 md:h-6 md:w-6 text-emerald-600' />
                    </div>
                    <div className='space-y-2'>
                      <h4 className='font-bold text-sm md:text-base text-emerald-900'>
                        Langkah yang disarankan:
                      </h4>
                      <p className='text-stone-700 leading-relaxed text-sm md:text-base'>
                        {scan.solution ||
                          "Belum ada solusi spesifik yang tersimpan dalam database."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className='mt-6 flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100/60 text-amber-800/80 text-xs md:text-sm'>
                  <AlertTriangle className='h-5 w-5 shrink-0 text-amber-500' />
                  <p className='leading-snug'>
                    Hasil diagnosa ini dihasilkan oleh AI. Disarankan untuk
                    tetap berkonsultasi dengan ahli pertanian sebelum mengambil
                    tindakan skala besar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
