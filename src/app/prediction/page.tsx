"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ScanLine,
  Sprout,
  Maximize2,
  Droplets,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { saveScanHistory } from "@/app/actions/save-history";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  const [activeTab, setActiveTab] = useState<"upload" | "result">("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
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
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const processFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Format file harus JPG, PNG, atau WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setFile(file);
    setResult(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    if (window.innerWidth < 1024) {
      setActiveTab("result");
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API URL belum dikonfigurasi.");

      const fileExt = file.name.split(".").pop();
      const fileName = `uploads/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error("Gagal upload gambar ke server.");

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: publicUrlData.publicUrl }),
      });

      const resultData = await response.json();
      if (!response.ok)
        throw new Error(resultData.error || "Gagal memproses data.");

      const fixedConfidence = parseFloat(
        Number(resultData.confidence).toFixed(1)
      );
      const fixedDescription = `Terdeteksi ${resultData.label} (${fixedConfidence}%)`;

      await saveScanHistory({
        imageUrl: publicUrlData.publicUrl,
        label: resultData.label,
        confidence: fixedConfidence,
        description: fixedDescription,
        solution: resultData.solution,
      });

      setResult({
        ...resultData,
        confidence: fixedConfidence,
        description: fixedDescription,
      });
      toast.success("Diagnosa berhasil selesai!");

      setActiveTab("result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan sistem.");
      toast.error("Gagal memproses permintaan.");
      setActiveTab("upload");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#F5F5F4] p-4 md:p-8 font-sans text-stone-900 rounded-4xl'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 py-2'>
          <div className='flex items-center gap-3'>
            <div className='bg-emerald-600 p-2.5 rounded-xl text-white shadow-sm'>
              <ScanLine className='w-6 h-6' />
            </div>
            <h1 className='text-2xl font-bold tracking-tight text-stone-800'>
              Halaman Prediksi
            </h1>
          </div>
          <div className='hidden md:flex gap-2'>
            <Badge
              variant='outline'
              className='border-emerald-200 text-emerald-700 bg-emerald-50 px-3 py-1'
            >
              System Ready
            </Badge>
          </div>
        </div>

        <div className='lg:hidden grid grid-cols-2 gap-1 p-1 bg-stone-200/50 rounded-xl'>
          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "py-2.5 text-sm font-semibold rounded-lg transition-colors",
              activeTab === "upload"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab("result")}
            disabled={!result && !isLoading}
            className={cn(
              "py-2.5 text-sm font-semibold rounded-lg transition-colors",
              activeTab === "result"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500",
              !result && !isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            Hasil
          </button>
        </div>

        <div className='bg-white/80 border border-white/50 rounded-[2.5rem] p-4 md:p-8 relative'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
            <div
              className={cn(
                "lg:col-span-5 space-y-6",
                "lg:block",
                activeTab === "upload" ? "block" : "hidden"
              )}
            >
              <Card className='border-0 shadow-none bg-transparent'>
                <CardHeader className='px-0 pt-0'>
                  <CardTitle className='text-lg font-semibold text-stone-700 flex justify-between items-center'>
                    Upload Foto
                    <span className='text-xs font-normal text-stone-400 bg-white px-2 py-1 rounded-full border border-stone-200'>
                      Langkah 1
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-0 space-y-4'>
                  <input
                    type='file'
                    ref={fileInputRef}
                    className='hidden'
                    accept='image/jpeg,image/png,image/webp'
                    onChange={handleFileSelect}
                  />

                  {!selectedImage ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "group relative border-2 border-dashed rounded-[2rem] h-80 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white hover:border-emerald-400",
                        isDragging
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-stone-200"
                      )}
                    >
                      <div className='p-4 bg-stone-50 rounded-full mb-4 group-hover:scale-105 transition-transform'>
                        <UploadCloud className='w-8 h-8 text-stone-400 group-hover:text-emerald-600' />
                      </div>
                      <span className='text-sm font-bold text-stone-600'>
                        Pilih File Gambar
                      </span>
                      <span className='text-xs text-stone-400 mt-1'>
                        Maksimal 5MB
                      </span>
                    </div>
                  ) : (
                    <div className='relative rounded-[2rem] overflow-hidden border border-stone-100 bg-white h-80 group shadow-sm'>
                      <Image
                        src={selectedImage}
                        alt='Preview'
                        fill
                        priority
                        className='object-contain p-4'
                      />
                      <Button
                        size='icon'
                        variant='destructive'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className='absolute top-4 right-4 rounded-full w-10 h-10 shadow-sm hover:scale-105 transition-transform'
                      >
                        <X className='w-5 h-5' />
                      </Button>
                    </div>
                  )}

                  <Button
                    className={cn(
                      "w-full h-14 rounded-2xl text-base font-bold shadow-sm transition-all",
                      isLoading
                        ? "bg-stone-100 text-stone-400 shadow-none"
                        : "bg-stone-900 hover:bg-emerald-700 text-white"
                    )}
                    disabled={!selectedImage || isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <span className='flex items-center gap-2'>
                        <Loader2 className='h-5 w-5 animate-spin' />
                        Memproses...
                      </span>
                    ) : (
                      <span className='flex items-center gap-2'>
                        Mulai Analisis
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {error && (
                <Alert
                  variant='destructive'
                  className='bg-red-50 border-none text-red-600 rounded-2xl'
                >
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle className='font-bold'>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div
              className={cn(
                "lg:col-span-7 h-full",
                "lg:block",
                activeTab === "result" ? "block" : "hidden"
              )}
            >
              {isLoading ? (
                <div className='h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-stone-50 rounded-[2rem] border border-stone-100'>
                  <Loader2 className='w-10 h-10 text-emerald-600 animate-spin mb-4' />
                  <p className='text-stone-500 font-medium'>
                    Sedang menganalisis...
                  </p>
                </div>
              ) : result ? (
                <div className='space-y-6'>
                  <div className='bg-stone-900 text-white rounded-[2rem] overflow-hidden relative shadow-lg p-6 md:p-8'>
                    <div className='flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2'>
                      <CheckCircle2 className='w-4 h-4' />
                      Selesai
                    </div>
                    <h2 className='text-3xl md:text-4xl font-bold leading-tight mb-6'>
                      {result.label}
                    </h2>

                    <div className='space-y-3'>
                      <div className='flex justify-between text-sm text-stone-400 font-medium'>
                        <span>Tingkat Akurasi</span>
                        <span className='text-emerald-400'>
                          {result.confidence}%
                        </span>
                      </div>
                      <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-emerald-500 rounded-full'
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100'>
                      <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600'>
                        <Maximize2 className='w-5 h-5' />
                      </div>
                      <h3 className='font-bold text-stone-800 mb-2'>
                        Gejala Terdeteksi
                      </h3>
                      <p className='text-stone-600 text-sm leading-relaxed'>
                        {result.description}
                      </p>
                    </div>

                    <div className='bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100/50'>
                      <div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600'>
                        <Sprout className='w-5 h-5' />
                      </div>
                      <h3 className='font-bold text-stone-800 mb-2'>
                        Solusi Perawatan
                      </h3>
                      <p className='text-stone-700 text-sm leading-relaxed font-medium'>
                        {result.solution}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-stone-200 rounded-[2rem] bg-stone-50/50'>
                  <div className='bg-white p-5 rounded-full shadow-sm mb-4'>
                    <Droplets className='w-8 h-8 text-stone-300' />
                  </div>
                  <h3 className='text-lg font-bold text-stone-700'>
                    Area Hasil
                  </h3>
                  <p className='text-stone-400 text-sm max-w-xs mt-1'>
                    Hasil prediksi dan solusi akan muncul di sini setelah proses
                    upload selesai.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
