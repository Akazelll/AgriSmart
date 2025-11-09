import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <div className='flex items-center border-b p-4'>
          <SidebarTrigger />
          <span className='ml-4 font-semibold'>AgriSmart Dashboard</span>
        </div>
        <div className='p-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
