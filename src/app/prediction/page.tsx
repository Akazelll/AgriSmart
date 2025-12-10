"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  ScanSearch,
  AlertCircle,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

// --- 1. INISIALISASI SUPABASE CLIENT ---
// Pastikan variabel ini ada di file .env.local Anda
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Harus ada NEXT_PUBLIC_
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 2. TIPE DATA ---
interface PredictionResult {
  label: string;
  confidence: number;
  description: string;
  solution: string;
}

export default function PredictPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 3. HANDLER FILE & DRAG DROP ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Mohon upload file gambar (JPG, PNG, JPEG)");
      return;
    }
    // Validasi ukuran (misal maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar (Maks 5MB)");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setFile(file);
    setResult(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- 4. LOGIKA UTAMA (UPLOAD -> PREDICT) ---
  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // A. Upload ke Supabase Storage
      // Gunakan timestamp agar nama file unik
      const fileName = `uploads/${Date.now()}-${file.name.replace(/\s/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("images") // Pastikan bucket 'images' sudah dibuat di Supabase
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`);
      }

      // B. Dapatkan Public URL
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;
      console.log("Gambar berhasil diupload:", publicUrl);

      // C. Kirim URL ke Backend Python
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://akazelll-api-agrismart.hf.space";

      // 2. Gunakan variable tersebut di fetch
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: publicUrl }),
      });

      const resultData = await response.json();

      if (!response.ok) {
        throw new Error(resultData.error || "Gagal memproses di server Python");
      }

      // D. Simpan Hasil
      setResult(resultData);
    } catch (err: any) {
      console.error("Error Flow:", err);
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. RENDER UI ---
  return (
    <div className='flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12 px-4 md:px-0'>
      {/* Header Halaman */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-stone-800 flex items-center gap-2'>
          <Leaf className='text-emerald-600' />
          Deteksi Penyakit Tanaman
        </h1>
        <p className='text-stone-500 text-lg'>
          Upload foto daun tanaman padi Anda untuk mendapatkan diagnosa instan
          dan solusi penanganannya.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        {/* --- KOLOM KIRI: UPLOAD CARD --- */}
        <Card className='border-none shadow-xl bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='text-xl flex items-center gap-2 text-stone-700'>
              <ScanSearch className='text-emerald-600' />
              Upload Gambar
            </CardTitle>
            <CardDescription>
              Format yang didukung: JPEG, PNG, JPG (Maks. 5MB)
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {!selectedImage ? (
              // Area Drag & Drop
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-3 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[320px] bg-stone-50",
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
                    : "border-stone-300 hover:border-emerald-400 hover:bg-emerald-50/30"
                )}
              >
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/jpeg, image/png, image/jpg'
                  onChange={handleFileSelect}
                />

                <div className='bg-white p-4 rounded-full mb-4 shadow-sm border border-stone-100'>
                  <Upload className='h-8 w-8 text-emerald-600' />
                </div>
                <p className='text-lg font-bold text-stone-700'>
                  Klik atau drag & drop
                </p>
                <p className='text-sm text-stone-400 mt-2 text-center max-w-xs'>
                  Upload foto daun dengan pencahayaan yang cukup agar hasil
                  prediksi akurat.
                </p>
              </div>
            ) : (
              // Area Preview Gambar
              <div className='relative rounded-[2rem] overflow-hidden border border-stone-200 shadow-sm bg-stone-50 group'>
                <div className='relative w-full h-[320px]'>
                  <Image
                    src={selectedImage}
                    alt='Preview'
                    fill
                    className='object-contain p-2'
                  />
                </div>
                {/* Tombol Hapus */}
                <div className='absolute top-4 right-4 z-10'>
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={handleRemoveImage}
                    className='rounded-full shadow-lg w-10 h-10 hover:scale-110 transition-transform'
                    disabled={isLoading}
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            )}

            {/* Tombol Aksi */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedImage || isLoading}
              className={cn(
                "w-full rounded-full py-6 text-lg shadow-lg transition-all hover:scale-[1.02] font-bold",
                isLoading
                  ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                  : "bg-[#3A6F43] hover:bg-emerald-800 text-white"
              )}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  Sedang Menganalisa...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <ScanSearch className='h-5 w-5' />
                  Analisa Sekarang
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* --- KOLOM KANAN: HASIL PREDIKSI --- */}
        <div className='space-y-6'>
          {/* Pesan Error */}
          {error && (
            <Alert
              variant='destructive'
              className='bg-red-50 border-red-200 text-red-800 rounded-2xl animate-in fade-in slide-in-from-top-2'
            >
              <AlertCircle className='h-5 w-5' />
              <AlertTitle className='font-bold ml-2'>
                Gagal Memproses
              </AlertTitle>
              <AlertDescription className='ml-2 mt-1'>{error}</AlertDescription>
            </Alert>
          )}

          {/* Kartu Hasil */}
          {result ? (
            <Card className='border-none shadow-xl bg-white/90 backdrop-blur-md overflow-hidden rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-8 duration-700'>
              {/* Header Hasil */}
              <div className='bg-emerald-600 p-6 text-white text-center relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-full bg-white/10 skew-y-6 transform origin-bottom-left' />
                <h3 className='font-bold text-xl flex items-center justify-center gap-2 relative z-10'>
                  <CheckCircle2 className='h-7 w-7' />
                  Hasil Analisa Selesai
                </h3>
              </div>

              <CardContent className='p-8 space-y-8'>
                {/* Label & Confidence */}
                <div className='text-center space-y-3'>
                  <p className='text-xs font-bold text-stone-400 uppercase tracking-widest'>
                    Penyakit Terdeteksi
                  </p>
                  <h2 className='text-4xl font-extrabold text-stone-800 leading-tight'>
                    {result.label}
                  </h2>
                  <div className='inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold shadow-sm'>
                    Tingkat Keyakinan: {result.confidence}%
                  </div>
                </div>

                <div className='w-full h-px bg-stone-100' />

                {/* Deskripsi & Solusi */}
                <div className='space-y-6'>
                  <div>
                    <h4 className='font-bold text-stone-700 mb-2 flex items-center gap-2'>
                      📋 Deskripsi
                    </h4>
                    <p className='text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100'>
                      {result.description}
                    </p>
                  </div>

                  <div>
                    <h4 className='font-bold text-amber-700 mb-2 flex items-center gap-2'>
                      💡 Solusi Rekomendasi
                    </h4>
                    <div className='bg-amber-50 p-5 rounded-2xl border border-amber-100 text-amber-900/90 leading-relaxed text-sm shadow-sm'>
                      {result.solution}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Placeholder Kosong (Saat belum ada hasil)
            !isLoading &&
            !error && (
              <div className='h-full min-h-[400px] flex flex-col items-center justify-center text-stone-400 border-3 border-dashed border-stone-200 rounded-[2.5rem] bg-white/40 p-8 text-center space-y-4'>
                <div className='bg-white p-6 rounded-full shadow-sm'>
                  <ScanSearch className='h-16 w-16 text-stone-300' />
                </div>
                <div>
                  <p className='text-lg font-semibold text-stone-500'>
                    Belum ada data
                  </p>
                  <p className='text-sm'>
                    Silakan upload gambar untuk melihat hasil prediksi.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Skeleton Loading saat proses */}
          {isLoading && !result && (
            <Card className='border-none shadow-lg bg-white/80 p-8 rounded-[2.5rem] space-y-4 animate-pulse'>
              <div className='h-8 bg-stone-200 rounded-full w-3/4 mx-auto' />
              <div className='h-4 bg-stone-100 rounded-full w-1/2 mx-auto' />
              <div className='h-px bg-stone-100 my-6' />
              <div className='space-y-2'>
                <div className='h-4 bg-stone-200 rounded-full w-full' />
                <div className='h-4 bg-stone-100 rounded-full w-5/6' />
                <div className='h-4 bg-stone-100 rounded-full w-4/6' />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
