import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sprout,
  CloudSun,
  Wallet,
  ShieldCheck,
  LayoutDashboard, // Icon baru untuk Dashboard
  ArrowRight,
} from "lucide-react";
import { auth } from "@/auth";

// --- UPDATE FITUR BERDASARKAN KODINGAN ---
const features = [
  {
    title: "Deteksi Penyakit AI",
    description:
      "Identifikasi penyakit padi seperti Hawar Daun dan Blast secara instan menggunakan foto.",
    icon: ShieldCheck,
  },
  {
    title: "Cuaca & Pemetaan",
    description:
      "Pantau suhu, kelembaban, dan prakiraan cuaca lokal untuk menjadwalkan waktu tanam.",
    icon: CloudSun,
  },
  {
    title: "Analisis Keuangan",
    description:
      "Kelola pengeluaran dan estimasi keuntungan panen dengan fitur pencatatan terintegrasi.",
    icon: Wallet,
  },
  {
    title: "Solusi Penanganan",
    description:
      "Dapatkan rekomendasi obat dan tindakan perawatan yang tepat berdasarkan diagnosa AI.",
    icon: Sprout,
  },
  {
    title: "Dashboard Terintegrasi", // PENGGANTI Asisten Cerdas
    description:
      "Pusat kontrol untuk memantau riwayat diagnosa, ringkasan cuaca, dan laporan aktivitas harian.",
    icon: LayoutDashboard,
  },
];

export default async function Home() {
  const session = await auth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Fitur", href: "#fitur" },
    { name: "Tentang Kami", href: "#tentang" },
  ];

  return (
    <div className='flex min-h-screen w-full flex-col bg-[#F8FAF8]'>
      <header className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-100 shadow-sm'>
        <div className='container mx-auto px-12 h-20 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='relative h-10 md:h-14 w-auto flex-shrink-0 transition-all duration-300'>
              <Image
                src='/img/logo2.png'
                alt='Logo AgriSmart'
                width={150}
                height={80}
                className='object-contain h-full w-auto'
                priority
              />
            </div>
          </Link>

          <div className='flex items-center gap-8'>
            <nav className='hidden md:flex items-center gap-8'>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className='text-sm font-semibold text-stone-600 hover:text-[#3A6F43] transition-colors'
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            {session ? (
              <Link href='/dashboard'>
                <Button className='rounded-full bg-[#3A6F43] hover:bg-[#2c4d35] text-white px-8 py-2 font-semibold shadow-lg shadow-emerald-900/10 transition-all hover:scale-105'>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href='/login'>
                <Button className='rounded-full bg-[#3A6F43] hover:bg-[#2c4d35] text-white px-8 py-2 font-semibold shadow-lg shadow-emerald-900/10 transition-all hover:scale-105'>
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className='grow flex flex-col items-center justify-center pt-20 pb-20 text-center px-4 py-16 bg-gradient-to-b from-emerald-50/50 to-transparent'>
        <div className='max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
          <div className='inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800 mb-4'>
            <span className='flex h-2 w-2 rounded-full bg-emerald-600 mr-2'></span>
            Teknologi AI untuk Petani Indonesia
          </div>

          <h1 className='text-4xl md:text-6xl font-extrabold text-[#3A6F43] tracking-tight leading-tight'>
            Diagnosa Penyakit Padi <br />
            <span className='text-stone-800'>Hanya dengan Satu Foto</span>
          </h1>

          <p className='text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed'>
            AgriSmart membantu Anda mendeteksi penyakit tanaman, memantau cuaca,
            dan mengelola keuangan tani agar hasil panen lebih maksimal dan
            efisien.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
            <Link href={session ? "/prediction" : "/login"}>
              <Button className='h-12 px-8 text-lg rounded-full bg-[#3A6F43] hover:bg-[#2c4d35] shadow-xl hover:shadow-2xl transition-all duration-300'>
                Coba Diagnosa Sekarang
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link href='#fitur'>
              <Button
                variant='outline'
                className='h-12 px-8 text-lg rounded-full border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              >
                Pelajari Fitur
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- FITUR SECTION --- */}
      <div
        className='w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center'
        id='fitur'
      >
        <h1 className='text-3xl md:text-4xl font-bold text-[#3A6F43] mb-4 text-center'>
          Fitur Unggulan
        </h1>
        <p className='text-stone-500 mb-12 text-center max-w-lg'>
          Platform terintegrasi yang menggabungkan kecerdasan buatan dengan
          kebutuhan nyata petani sehari-hari.
        </p>

        <div className='flex flex-wrap justify-center gap-6 w-full'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className='w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] bg-[#A1BC98] drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300 flex flex-col items-center text-center p-6 border-none rounded-3xl group hover:-translate-y-1'
            >
              <CardHeader className='flex flex-col items-center'>
                <div className='w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white group-hover:bg-white group-hover:text-[#3A6F43] transition-colors duration-300'>
                  <feature.icon size={28} />
                </div>
                <CardTitle className='text-xl font-bold text-stone-800'>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-stone-700 font-medium leading-relaxed'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- TENTANG SECTION --- */}
      <div
        className='w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center mb-12'
        id='tentang'
      >
        <h1 className='text-3xl md:text-4xl font-bold text-[#3A6F43] mb-12 text-center'>
          Tentang Kami
        </h1>

        <div className='flex w-full'>
          <Card className='w-full bg-white drop-shadow-2xl border-none rounded-3xl overflow-hidden'>
            <div className='flex flex-col md:flex-row'>
              {/* Ilustrasi Visual */}
              <div className='w-full md:w-1/3 bg-[#3A6F43] p-8 flex items-center justify-center relative overflow-hidden'>
                {/* Pattern Background Overlay (Optional) */}
                <div className="absolute inset-0 bg-[url('/img/pattern.png')] opacity-10"></div>
                <Image
                  src='/img/padi 2.png'
                  alt='Ilustrasi Padi'
                  width={300}
                  height={300}
                  className='object-contain drop-shadow-lg z-10 hover:scale-105 transition-transform duration-500'
                />
              </div>

              <div className='w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center'>
                <CardHeader className='p-0 mb-6'>
                  <CardTitle className='text-3xl font-bold text-stone-800 mb-2'>
                    Mitra Digital Petani Modern
                  </CardTitle>
                  <div className='h-1 w-20 bg-[#3A6F43] rounded-full'></div>
                </CardHeader>
                <CardContent className='p-0'>
                  <p className='text-stone-600 leading-relaxed text-justify text-lg mb-6'>
                    AgriSmart hadir sebagai solusi pertanian presisi yang
                    dirancang khusus untuk membantu petani padi menghadapi
                    tantangan penyakit dan iklim. Sistem kami dilatih
                    menggunakan ribuan data citra daun untuk mengenali penyakit
                    seperti <b>Bacterial Leaf Blight</b>, <b>Brown Spot</b>, dan{" "}
                    <b>Leaf Smut</b> dengan akurasi tinggi.
                  </p>
                  <p className='text-stone-600 leading-relaxed text-justify text-lg'>
                    Lebih dari sekadar alat diagnosa, AgriSmart mengintegrasikan
                    <b> analisis keuangan</b> dan <b>pemantauan cuaca</b> untuk
                    memberdayakan petani dalam mengambil keputusan yang berbasis
                    data, meningkatkan hasil panen, dan mewujudkan pertanian
                    yang lebih berkelanjutan.
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <footer>
        <div className='w-full border-t border-stone-200 items-center py-8 mt-12 bg-white'>
          <div className='container mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <Image
                src='/img/logo2.png'
                alt='Logo AgriSmart'
                width={100}
                height={50}
                className='opacity-80 grayscale hover:grayscale-0 transition-all duration-300'
              />
            </div>
            <p className='text-sm text-stone-500 text-center md:text-right font-medium'>
              &copy; {new Date().getFullYear()} AgriSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
