import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@supabase/supabase-js";
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

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user?.email)
    .single();

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <div className='fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10'>
        <div className='absolute left-[41px] top-[50px] w-[242.6px] h-[168.54px] bg-[#3A6F43]/60 rounded-full blur-[60px]' />
        <div className='absolute left-[762.9px] top-[133.95px] w-[346.35px] h-[182.55px] bg-[#3A6F43]/50 rounded-full blur-[70px]' />
        <div className='absolute left-[1358.62px] top-[36.07px] w-[543.5px] h-[36.07px] bg-[#D9D9D9]/80 rounded-full blur-[40px]' />
        <div className='absolute left-[-185px] top-[764px] w-[755.46px] h-[498.7px] bg-[#3A6F43]/40 rounded-full blur-[100px]' />
      </div>

      <main className='relative flex min-h-screen w-full flex-col bg-stone-50/30'>
        <header className='sticky top-0 z-50 w-full bg-white/36 backdrop-blur-md border-b border-white/20 shadow-sm'>
          <div className='container mx-auto px-6 md:px-12 h-20 flex items-center justify-between'>
            <div className='flex items-center gap-4 md:gap-6'>
              <SidebarTrigger className='scale-125 text-stone-600 hover:bg-white/50 rounded-full p-2 transition-all' />
              <Link href='/dashboard' className='flex items-center gap-2'>
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
            </div>

            <div className='flex items-center gap-8'>
              <div className='flex items-center gap-3 pl-1 pr-4 py-1'>
                <div className='hidden md:flex flex-row items-center gap-4'>
                  {user?.image ? (
                    <div className='relative w-10 h-10 rounded-full overflow-hidden border border-stone-200'>
                      <Image
                        src={user.image}
                        alt='Profile'
                        fill
                        className='object-cover'
                      />
                    </div>
                  ) : (
                    <FaRegCircleUser className='text-4xl text-stone-600 drop-shadow-sm' />
                  )}

                  <p className='text-xl font-medium text-stone-700'>
                    {user?.name || "Pengguna"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className='flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-0'>
          {children}
        </div>
      </main>

      <ChatBubble />
    </SidebarProvider>
  );
}
