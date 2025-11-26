import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sprout,
  CloudSun,
  LineChart,
  Droplets,
  ShieldAlert,
} from "lucide-react";

const features = [
  {
    title: "Pemantauan Tanaman",
    description:
      "Pantau kondisi tanaman secara real-time dengan data kesehatan tanaman terkini.",
    icon: Sprout,
  },
  {
    title: "Prediksi Cuaca",
    description:
      "Dapatkan informasi cuaca akurat untuk merencanakan waktu tanam dan panen.",
    icon: CloudSun,
  },
  {
    title: "Analisis Panen",
    description:
      "Estimasi hasil panen menggunakan algoritma cerdas berbasis data historis.",
    icon: LineChart,
  },
  {
    title: "Manajemen Irigasi",
    description:
      "Optimalkan penggunaan air dengan rekomendasi berdasarkan kelembaban tanah.",
    icon: Droplets,
  },
  {
    title: "Deteksi Hama",
    description:
      "Identifikasi dini risiko hama dan penyakit untuk penanganan yang lebih cepat.",
    icon: ShieldAlert,
  },
];
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default function Home() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Fitur", href: "#fitur" },
    { name: "Tentang Kami", href: "#tentang" },
  ];

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <header className='sticky top-0 z-50 w-full bg-transparent/80 backdrop-blur-md border-b border-stone-100 shadow-sm'>
        <div className='container mx-auto px-12 h-20 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='relative h-10 w-auto flex-shrink-0'>
              <Image
                src='/img/TULISAN 2.png'
                alt='Logo AgriSmart'
                width={150}
                height={40}
                className='object-contain h-10 w-auto'
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
                  className='text-sm font-semibold text-dark-600 hover:text-emerald-700 transition-colors'
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <Link href='/login'>
              <Button className='rounded-full bg-[#3A6F43] hover:bg-[#2c4d35] text-white px-8 py-2 font-semibold shadow-lg shadow-emerald-900/10 transition-all hover:scale-105'>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='grow flex flex-col items-center justify-center pt-20 pb-20 text-center px-4 py-16'></main>

      <div
        className='w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center'
        id='fitur'
      >
        <h1 className='text-3xl md:text-4xl font-medium text-dark mb-12 text-center'>
          Fitur Utama
        </h1>
        <div className='flex flex-wrap justify-center gap-6 w-full'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className='w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] bg-[#A1BC98] drop-shadow-2xl flex flex-col items-center text-center p-6 border-none'
            >
              <CardHeader>
                {/* <div className='w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600'>
                  <feature.icon size={24} />
                </div> */}
                <CardTitle className='text-xl font-semibold text-stone-800'>
                  {/* {feature.title} */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-stone-500 leading-relaxed'>
                  {/* {feature.description} */}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div
        className='w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center'
        id='tentang'
      >
        <h1 className='text-3xl mmd:text-4xl font-medium text-dark mb-12 text-center'>
          Tentang Kami
        </h1>

        <div className='flex '>
          <Card className='w-full bg-white drop-shadow-2xl '>
            <CardHeader>
              <CardTitle className='text-xl font-semibold text-stone-800 text-center'>
                {/* AgriSmart */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <p className="text-stone-500 leading-relaxed text-justify">
                AgriSmart adalah aplikasi pertanian cerdas yang dirancang untuk membantu petani meningkatkan produktivitas dan efisiensi dalam mengelola lahan pertanian mereka. Dengan memanfaatkan teknologi terkini, AgriSmart menyediakan berbagai fitur seperti pemantauan tanaman secara real-time, prediksi cuaca akurat, analisis hasil panen, manajemen irigasi yang optimal, dan deteksi dini hama serta penyakit tanaman. Aplikasi ini bertujuan untuk memberdayakan petani dengan informasi yang tepat sehingga mereka dapat membuat keputusan yang lebih baik dalam praktik pertanian mereka, meningkatkan hasil panen, dan mengurangi dampak lingkungan.
              </p> */}
            </CardContent>
          </Card>
        </div>
      </div>

      <footer>
        <div className='w-full border-t items-center py-6 mt-12 bg-[#D9D9D9]'>
          <div className='container mx-auto px-12 flex flex-col md:flex-row items-center justify-center'>
            <p className='text-sm text-stone-500 text-center'>
              &copy; {new Date().getFullYear()} AgriSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
