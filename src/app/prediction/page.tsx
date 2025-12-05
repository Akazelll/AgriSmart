"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  X,
  ScanSearch,
  Sprout,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PredictionResult {
  label: string;
  confidence: number;
  description: string;
  solution: string;
}

export default function PenyakitPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // PENTING: Gunakan Port 8000 sesuai backend Python
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal terhubung ke server AI.");
      }

      const data = await response.json();

      setResult({
        label: data.label,
        confidence: data.confidence,
        description: data.description,
        solution: data.solution,
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        // Gagal memproses: ${error.message}\nPastikan server Python (app.py) sudah berjalan di port 8000!
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4 md:p-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-stone-800 flex items-center gap-2">
          <Sprout className="text-[#3A6F43]" size={32} />
          Deteksi Penyakit Padi
        </h1>
        <p className="text-stone-500">
          Unggah foto daun padi untuk mendeteksi penyakit dan mendapatkan solusi
          penanganan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Upload */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-md rounded-[2rem] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-stone-700">
                Upload Gambar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={cn(
                  "relative w-full min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden bg-stone-50/50",
                  imagePreview
                    ? "border-[#3A6F43]/30"
                    : "border-stone-300 hover:border-[#3A6F43]/50 hover:bg-stone-100/50"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full min-h-[300px] group">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        onClick={handleRemoveImage}
                        className="rounded-full h-12 w-12 p-0 shadow-lg"
                      >
                        <X size={24} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center gap-4 p-8 text-center cursor-pointer"
                    onClick={handleUploadClick}
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-[#3A6F43] mb-2 shadow-sm">
                      <Upload size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-stone-700">
                        Klik untuk upload atau drag & drop
                      </p>
                      <p className="text-sm text-stone-400">
                        Format: JPG, PNG, JPEG
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                  className={cn(
                    "w-full md:w-auto rounded-full px-8 py-6 text-lg font-medium shadow-lg transition-all hover:scale-105",
                    isLoading
                      ? "bg-stone-400"
                      : "bg-[#3A6F43] hover:bg-[#2c4d35]"
                  )}
                >
                  {isLoading ? (
                    "Menganalisis..."
                  ) : (
                    <>
                      <ScanSearch className="mr-2 h-5 w-5" /> Analisis Gambar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Hasil */}
        <div className="lg:col-span-5 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-stone-200 rounded-[2rem] text-stone-400 bg-white/30">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p className="text-lg">Hasil analisis akan muncul di sini</p>
            </div>
          )}

          {isLoading && (
            <Card className="border-none shadow-lg bg-white rounded-[2rem] p-6 space-y-4 animate-pulse">
              <div className="h-8 bg-stone-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-stone-200 rounded-lg w-1/2"></div>
              <div className="h-32 bg-stone-200 rounded-2xl w-full mt-4"></div>
            </Card>
          )}

          {result && !isLoading && (
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden border-t-8 border-t-[#3A6F43]">
              <CardHeader className="bg-[#f4f5f0] pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                      Terdeteksi
                    </p>
                    <CardTitle className="text-3xl font-bold text-[#3A6F43] mt-1">
                      {result.label}
                    </CardTitle>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {result.confidence}% Akurat
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />{" "}
                    Deskripsi Masalah
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {result.description}
                  </p>
                </div>
                <div className="w-full border-t border-stone-100" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />{" "}
                    Rekomendasi Solusi
                  </h3>
                  <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-100">
                    <p className="text-emerald-900 text-sm leading-relaxed font-medium">
                      {result.solution}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}