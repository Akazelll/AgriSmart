import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <main className='flex min-h-screen w-full flex-col'>
        <header className='sticky top-0 z-50 w-full bg-transparent/80 backdrop-blur-md border-b border-stone-100 shadow-sm'>
          <div className='container mx-auto px-6 md:px-12 h-20 flex items-center justify-between'>

            <div className='flex items-center gap-4 md:gap-6'>
              <SidebarTrigger className='scale-125 text-stone-600 hover:bg-stone-100 rounded-full p-2 transition-all' />
              <Link href='/dashboard' className='flex items-center gap-2'>
                <div className='relative h-10 w-auto flex-shrink-0'>
                  <Image
                    src='/img/TULISAN 2.png'
                    alt='Logo AgriSmart'
                    width={150}
                    height={40}
                    className='object-contain h-8 md:h-10 w-auto'
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className='flex items-center gap-8'>
              <div className='flex items-center gap-3 pl-1 pr-4 py-1 '>
                <div className='hidden md:flex flex-rowc items-center gap-4'>
                  <FaRegCircleUser  className="text-4xl  "/>
                  <span className='text-3xl font-bold sh '>
                    {session.user?.name?.split(" ")[0] || "Pengguna"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className='flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
