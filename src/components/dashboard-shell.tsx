import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";
import { ChatBubble } from "@/components/chat-bubble";

export async function DashboardShell({
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

      <main className='relative flex min-h-screen w-full flex-col overflow-hidden bg-stone-50/30'>
        <div
          className='fixed -top-[150px] -left-[150px] w-[600px] h-[600px] 
                     bg-[3A6F43]/80 rounded-full blur-[120px] 
                     pointer-events-none -z-10 mix-blend-multiply'
        />
        <div
          className='fixed -bottom-[200px] -right-[200px] w-[800px] h-[800px] 
                     bg-[3A6F43]/87 rounded-full blur-[150px] 
                     pointer-events-none -z-10'
        />

        <header className='sticky top-0 z-50 w-full bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm'>
          <div className='container mx-auto px-6 md:px-12 h-20 flex items-center justify-between'>
            <div className='flex items-center gap-4 md:gap-6'>
              <SidebarTrigger className='scale-125 text-stone-600 hover:bg-white/50 rounded-full p-2 transition-all' />
              <Link href='/dashboard' className='flex items-center gap-2'>
                <div className='relative h-10 w-auto flex-shrink-0'>
                  <Image
                    src='/img/logo2.png'
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
              <div className='flex items-center gap-3 pl-1 pr-4 py-1'>
                <div className='hidden md:flex flex-row items-center gap-4'>
                  <FaRegCircleUser className='text-4xl text-stone-600 drop-shadow-sm' />
                  <p className='text-xl font-medium text-stone-700'>
                    {session.user?.name?.split(" ")[0] || "Pengguna"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* KONTEN UTAMA */}
        <div className='flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-0'>
          {children}
        </div>
      </main>

      <ChatBubble />
    </SidebarProvider>
  );
}
