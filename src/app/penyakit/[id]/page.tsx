// File: src/app/penyakit/[id]/page.tsx

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
  // Kita tambahkan filter eq("user_id", session.user.id) untuk keamanan
  // agar user tidak bisa melihat detail scan milik orang lain.
  const { data: scan, error } = await supabase
    .from("scan_history")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  // Jika data tidak ditemukan atau error, arahkan ke 404
  if (error || !scan) {
    return notFound();
  }

  // Helper: Format Tanggal dan Waktu
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  // Tentukan warna badge berdasarkan confidence score
  const isHighConfidence = scan.confidence >= 80;
  const isMediumConfidence = scan.confidence >= 50 && scan.confidence < 80;

  let badgeColor = "bg-red-50 text-red-700 border-red-200";
  let badgeText = "Akurasi Rendah";

  if (isHighConfidence) {
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    badgeText = "Sangat Akurat";
  } else if (isMediumConfidence) {
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    badgeText = "Perlu Verifikasi";
  }

  return (
    <div className='min-h-screen bg-stone-50/40 p-4 md:p-8 flex justify-center pb-20'>
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
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* --- KOLOM KIRI: Gambar & Statistik --- */}
          <div className='lg:col-span-5 space-y-6 sticky top-24'>
            {/* Wrapper Gambar */}
            <div className='relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-stone-200 shadow-xl border-4 border-white'>
              <Image
                src={scan.image_url}
                alt={scan.label}
                fill
                className='object-cover hover:scale-105 transition-transform duration-700 ease-in-out'
                priority
              />

              {/* Overlay Gradient (Mobile Only) */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden' />
            </div>

            {/* Kartu Statistik Ringkas */}
            <Card className='rounded-3xl border-stone-100 shadow-sm bg-white overflow-hidden'>
              <CardContent className='p-0'>
                <div className='flex flex-col'>
                  {/* Confidence */}
                  <div className='p-6 flex items-center justify-between hover:bg-stone-50 transition-colors'>
                    <div className='flex items-center gap-4 text-stone-600'>
                      <div className='p-2.5 bg-emerald-100 rounded-2xl text-emerald-600'>
                        <Activity size={20} />
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-stone-400 uppercase tracking-wider'>
                          Tingkat Keyakinan
                        </p>
                        <p className='font-semibold text-stone-700'>
                          Analisis Efficientnet
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        isHighConfidence ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {scan.confidence}%
                    </span>
                  </div>

                  <Separator className='bg-stone-100' />

                  {/* Tanggal */}
                  <div className='p-6 flex items-center justify-between hover:bg-stone-50 transition-colors'>
                    <div className='flex items-center gap-4 text-stone-600'>
                      <div className='p-2.5 bg-blue-100 rounded-2xl text-blue-600'>
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-stone-400 uppercase tracking-wider'>
                          Waktu Pemindaian
                        </p>
                        <p className='font-semibold text-stone-700'>
                          Tanggal & Jam
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <span className='text-sm font-semibold text-stone-800 block'>
                        {new Date(scan.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className='text-xs text-stone-400'>
                        {new Date(scan.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- KOLOM KANAN: Detail & Solusi --- */}
          <div className='lg:col-span-7 space-y-6'>
            {/* Header Judul */}
            <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col gap-4'>
              <div className='flex items-start justify-between flex-wrap gap-4'>
                <div>
                  <h1 className='text-3xl md:text-4xl font-extrabold text-stone-800 leading-tight mb-2'>
                    {scan.label}
                  </h1>
                  <p className='text-stone-500'>
                    Hasil identifikasi penyakit tanaman padi.
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className={`px-4 py-2 text-sm font-semibold border rounded-full ${badgeColor}`}
                >
                  {badgeText}
                </Badge>
              </div>
            </div>

            {/* Konten Utama */}
            <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8'>
              {/* Bagian Deskripsi */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-blue-50 p-2 rounded-xl text-blue-600'>
                    <Info size={24} />
                  </div>
                  <h3 className='text-xl font-bold text-stone-800'>
                    Tentang Penyakit
                  </h3>
                </div>
                <div className='bg-stone-50 p-6 rounded-3xl border border-stone-100'>
                  <p className='text-stone-600 leading-relaxed text-lg'>
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
                    <ThermometerSun size={24} />
                  </div>
                  <h3 className='text-xl font-bold text-stone-800'>
                    Rekomendasi Penanganan
                  </h3>
                </div>

                <div className='bg-gradient-to-br from-emerald-50 to-white p-6 rounded-3xl border border-emerald-100/50 shadow-sm'>
                  <div className='flex gap-4'>
                    <div className='shrink-0 mt-1'>
                      <CheckCircle2 className='h-6 w-6 text-emerald-600' />
                    </div>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-emerald-900'>
                        Langkah yang disarankan:
                      </h4>
                      <p className='text-stone-700 leading-relaxed'>
                        {scan.solution ||
                          "Belum ada solusi spesifik yang tersimpan dalam database."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className='mt-6 flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800/80 text-sm'>
                  <AlertTriangle className='h-5 w-5 shrink-0' />
                  <p>
                    Hasil diagnosa ini dihasilkan oleh Model Deep Learning Efficientnet.
                    Meskipun memiliki tingkat akurasi tinggi, disarankan untuk
                    tetap berkonsultasi dengan ahli pertanian atau penyuluh
                    setempat sebelum mengambil tindakan penanganan skala besar.
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
