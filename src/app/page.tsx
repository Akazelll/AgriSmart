import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { LoginButton } from "@/components/login-button";


export default function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col font-sans'>
      <header className='container mx-auto px-4 py-6'>
        <h2 className='text-2xl font-bold'>AgriSmart</h2>
      </header>

      <main className='flex-grow'>
        <section className='flex flex-col items-center justify-center bg-green-100 py-20 text-center'>
          <div className='container mx-auto max-w-3xl px-4'>
            <h1 className='mx-auto max-w-xs text-3xl font-semibold '>
              AgriSmart: Prediksi Panen & Rekomendasi Pertanian
            </h1>
            <p className='mx-auto mt-4 max-w-md text-lg text-zinc-600 '>
              Sistem berbasis data mining untuk meminimalkan risiko iklim dan
              meningkatkan keputusan budidaya petani kecil
            </p>
            <div className='mt-10 flex justify-center gap-x-6'>
              <LoginButton />
            </div>
          </div>
        </section>

        <section className='container mx-auto px-4 py-16'>
          <h2 className='mb-12 text-center text-3xl font-semibold tracking-light'>
            Fitur Utama AgriSmart
          </h2>
          <div className='flex flex-wrap justify-center gap-6'>
            <Card className='text-center w-full md:max-w-sm'>
              <CardHeader>
                <CardTitle>Prediksi Panen Akurat</CardTitle>
                <CardDescription>
                  Prediksi Hasil Panen berdasarkan data cuaca, jenis tanah, dan
                  pola tanam
                </CardDescription>
                <CardContent>
                  <p>Dapatkan Hasil Panen yang andal.</p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className='text-center w-full md:max-w-sm'>
              <CardHeader>
                <CardTitle>Prediksi Panen Akurat</CardTitle>
                <CardDescription>
                  Prediksi Hasil Panen berdasarkan data cuaca, jenis tanah, dan
                  pola tanam
                </CardDescription>
                <CardContent>
                  <p>Dapatkan Hasil Panen yang andal.</p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className='text-center w-full md:max-w-sm'>
              <CardHeader>
                <CardTitle>Prediksi Panen Akurat</CardTitle>
                <CardDescription>
                  Prediksi Hasil Panen berdasarkan data cuaca, jenis tanah, dan
                  pola tanam
                </CardDescription>
                <CardContent>
                  <p>Dapatkan Hasil Panen yang andal.</p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className='text-center w-full md:max-w-sm'>
              <CardHeader>
                <CardTitle>Prediksi Panen Akurat</CardTitle>
                <CardDescription>
                  Prediksi Hasil Panen berdasarkan data cuaca, jenis tanah, dan
                  pola tanam
                </CardDescription>
                <CardContent>
                  <p>Dapatkan Hasil Panen yang andal.</p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className='text-center w-full md:max-w-sm'>
              <CardHeader>
                <CardTitle>Prediksi Panen Akurat</CardTitle>
                <CardDescription>
                  Prediksi Hasil Panen berdasarkan data cuaca, jenis tanah, dan
                  pola tanam
                </CardDescription>
                <CardContent>
                  <p>Dapatkan Hasil Panen yang andal.</p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <footer className='border-t py-10'>
        <div className='container mx-auto px-4 text-center text-sm text-zinc-500'>
          &copy; {new Date().getFullYear()} AgriSmart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
