import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CalendarDays,
  ArrowRight,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Activity,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default async function PenyakitPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const params = await searchParams;

  const currentPage = Number(params?.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const { count } = await supabase
    .from("scan_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id);
  const { data: histories } = await supabase
    .from("scan_history")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 90)
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    if (confidence >= 70)
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
    return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
  };

  return (
    <div className='min-h-screen bg-[#F8FAF8] p-4 md:p-8 font-sans rounded-4xl'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-extrabold text-stone-800 tracking-tight'>
              Riwayat Diagnosa
            </h1>
            <p className='text-stone-500 mt-2 max-w-lg leading-relaxed'>
              Arsip lengkap hasil analisis kesehatan tanaman padi Anda. Pantau
              perkembangan penyakit dari waktu ke waktu.
            </p>
          </div>

          <div className='flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-stone-200 shadow-sm'>
            <div className='bg-emerald-100 p-2 rounded-full'>
              <Activity size={18} className='text-emerald-700' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>
                Total Scan
              </span>
              <span className='text-lg font-bold text-stone-800 leading-none'>
                {count || 0}
              </span>
            </div>
          </div>
        </div>

        {!histories || histories.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-dashed border-stone-200 text-center shadow-sm'>
            <div className='bg-stone-50 p-6 rounded-full mb-6 ring-8 ring-stone-50/50'>
              <SearchX className='h-12 w-12 text-stone-300' />
            </div>
            <h3 className='text-xl font-bold text-stone-700'>
              Belum ada riwayat
            </h3>
            <p className='text-stone-400 max-w-sm mx-auto mt-2 mb-8'>
              Lakukan diagnosa pertama Anda untuk mulai memantau kesehatan
              tanaman.
            </p>
            <Link href='/prediction'>
              <Button className='rounded-full bg-emerald-600 hover:bg-emerald-700'>
                Mulai Diagnosa Baru
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {histories.map((item) => (
                <Link
                  href={`/penyakit/${item.id}`}
                  key={item.id}
                  className='group h-full'
                >
                  <Card className='h-full flex flex-col overflow-hidden rounded-3xl border-stone-200 bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1 group-hover:border-emerald-200/60'>
                    <div className='relative h-56 w-full overflow-hidden bg-stone-100'>
                      <Image
                        src={item.image_url}
                        alt={item.label}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60' />

                      <div className='absolute top-4 right-4'>
                        <Badge
                          variant='outline'
                          className={`backdrop-blur-md shadow-sm border ${getConfidenceStyle(
                            item.confidence
                          )}`}
                        >
                          {item.confidence}% Akurat
                        </Badge>
                      </div>

                      <div className='absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-xs font-medium bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10'>
                        <CalendarDays size={12} />
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <CardHeader className='pb-2 pt-5 px-6'>
                      <div className='flex items-center gap-2 mb-1'>
                        <div className='p-1.5 rounded-md bg-emerald-50 text-emerald-600'>
                          <Leaf size={14} />
                        </div>
                        <span className='text-xs font-bold text-emerald-700 uppercase tracking-wider'>
                          Hasil Diagnosa
                        </span>
                      </div>
                      <h3 className='text-xl font-bold text-stone-800 line-clamp-1 group-hover:text-emerald-700 transition-colors'>
                        {item.label}
                      </h3>
                    </CardHeader>

                    <CardContent className='px-6 pb-4 flex-grow'>
                      <p className='text-sm text-stone-500 line-clamp-3 leading-relaxed'>
                        {item.solution ||
                          "Tidak ada detail solusi yang tersedia untuk penyakit ini."}
                      </p>
                    </CardContent>

                    <CardFooter className='px-6 pb-6 pt-0 mt-auto'>
                      <div className='w-full pt-4 border-t border-stone-100 flex items-center justify-between group-hover:border-emerald-50 transition-colors'>
                        <span className='text-xs font-semibold text-stone-400 group-hover:text-emerald-600/70 transition-colors'>
                          Lihat Detail
                        </span>
                        <div className='h-8 w-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300'>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-12 py-4'>
                <Link
                  href={hasPrevPage ? `/penyakit?page=${currentPage - 1}` : "#"}
                  className={!hasPrevPage ? "pointer-events-none" : ""}
                >
                  <Button
                    variant='outline'
                    size='icon'
                    disabled={!hasPrevPage}
                    className='rounded-full h-10 w-10 border-stone-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-50'
                  >
                    <ChevronLeft size={16} />
                  </Button>
                </Link>

                <div className='flex items-center gap-1 px-4'>
                  <span className='text-sm font-medium text-stone-600'>
                    Halaman{" "}
                    <span className='font-bold text-stone-900'>
                      {currentPage}
                    </span>{" "}
                    dari {totalPages}
                  </span>
                </div>

                <Link
                  href={hasNextPage ? `/penyakit?page=${currentPage + 1}` : "#"}
                  className={!hasNextPage ? "pointer-events-none" : ""}
                >
                  <Button
                    variant='outline'
                    size='icon'
                    disabled={!hasNextPage}
                    className='rounded-full h-10 w-10 border-stone-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-50'
                  >
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
