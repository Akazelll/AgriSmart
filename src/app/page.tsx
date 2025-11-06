import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col font-sans'>

      <header className='container mx-auto px-4 py-6'>
        <h2 className='text-2xl font-bold'>AgriSmart</h2>
      </header>

      <main className="flex-grow">
        <section className='flex items-center justify-content-center bg-zinc-50 py-20 text-center dark:bg-zinc-900'>
          <div className='container mx-auto max-w-3xl px-4'>
            <h1 className='max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 sm:max-w-none sm:text-5xl'>
              AgriSmart: Prediksi Panen & Rekomendasi Pertanian
            </h1>
            <p className='mt-6 max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:mx-auto'>
              Sistem berbasis data mining untuk meminimalkan risiko iklim dan
              meningkatkan keputusan budidaya petani kecil
            </p>
            <div className="mt-10">
              <Button size="lg" variant="outline">Mulai Sekarang</Button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
